import { Client } from "@stomp/stompjs";
import { useCallback, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { useUser } from "../../../store/userStore";

export const useWebSocket = (roomId, userId, onMessageReceived) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const clientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const user = useUser();

  // WebSocket 연결
  const connect = useCallback(() => {
    if (!roomId || !userId || roomId === "undefined" || userId === "undefined") {
      console.log("WebSocket 연결 조건 미충족:", { roomId, userId });
      return;
    }

    try {
      console.log("WebSocket 연결 시작...");
      console.log("환경 변수 NEXT_PUBLIC_SOCKJS_URL:", process.env.NEXT_PUBLIC_SOCKJS_URL);
      console.log("사용자 정보:", { userId, user });

      // 사용자 정보를 포함한 연결 헤더 설정
      const connectHeaders = {};
      if (userId) {
        connectHeaders["user-id"] = userId.toString();
      }
      if (user) {
        if (user.nickname) {
          connectHeaders["user-name"] = user.nickname;
        } else if (user.name) {
          connectHeaders["user-name"] = user.name;
        } else if (user.loginId) {
          connectHeaders["user-name"] = user.loginId;
        }
      }

      console.log("STOMP 연결 헤더:", connectHeaders);

      // STOMP Client 생성 (SockJS 사용)
      const client = new Client({
        webSocketFactory: () => {
          const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "http://localhost:8000/ws-stomp";
          console.log("연결 URL:", url);
          console.log("사용된 URL:", url);
          return new SockJS(url, null, {
            transports: ["websocket", "xhr-streaming", "xhr-polling"],
            withCredentials: true,
          });
        },
        connectHeaders: connectHeaders,
        debug: (str) => {
          console.log("STOMP Debug:", str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      // 연결 성공 콜백
      client.onConnect = (frame) => {
        console.log("WebSocket 연결 성공! Frame:", frame);
        setIsConnected(true);
        setError(null);
        clientRef.current = client;
        reconnectAttemptsRef.current = 0; // 연결 성공 시 재시도 횟수 초기화

        // 채팅방 구독
        client.subscribe(`/topic/room.${roomId}`, (message) => {
          try {
            // JSON 파싱 시도
            const messageData = JSON.parse(message.body);
            onMessageReceived(messageData);
          } catch (error) {
            // JSON이 아닌 경우 문자열 메시지로 처리
            console.log("문자열 메시지 수신:", message.body);
            const stringMessage = {
              content: message.body,
              messageType: "SYSTEM",
              sentAt: new Date().toISOString(),
            };
            onMessageReceived(stringMessage);
          }
        });

        // 개인 알림 구독
        client.subscribe("/user/queue/notice", (message) => {
          console.log("개인 알림:", message.body);
        });

        // 에러 알림 구독
        client.subscribe("/user/queue/error", (message) => {
          console.error("에러 알림:", message.body);
          setError(message.body);
        });
      };

      // 연결 실패 콜백
      client.onStompError = (frame) => {
        console.error("STOMP 오류:", frame);
        setIsConnected(false);

        // 인증 관련 오류인지 확인
        if (
          frame.headers.message &&
          (frame.headers.message.includes("401") ||
            frame.headers.message.includes("Unauthorized") ||
            frame.headers.message.includes("Forbidden"))
        ) {
          setError("인증이 필요합니다. 로그인 후 다시 시도해주세요.");
          // 인증 오류 시 재연결 중단
          client.deactivate();
          return;
        } else {
          setError("WebSocket 연결에 실패했습니다.");
        }
      };

      // 연결 해제 콜백
      client.onDisconnect = () => {
        console.log("WebSocket 연결 해제됨");
        setIsConnected(false);
        clientRef.current = null;
      };

      // 연결 시작
      client.activate();
    } catch (error) {
      console.error("WebSocket 초기화 오류:", error);
      setError("WebSocket 초기화에 실패했습니다.");
      setIsConnected(false);
    }
  }, [roomId, userId, onMessageReceived]);

  // 연결 상태 확인
  const checkConnectionStatus = useCallback(() => {
    if (clientRef.current) {
      const connected = clientRef.current.connected;
      // 연결 상태가 변경될 때만 로그 출력
      if (connected !== isConnected) {
        console.log("STOMP 연결 상태 변경:", connected);
        setIsConnected(connected);
      }
      return connected;
    }
    return false;
  }, [isConnected]);

  // 메시지 전송
  const sendMessage = useCallback(
    (content, senderName) => {
      const isStompConnected = checkConnectionStatus();

      if (!clientRef.current || !isStompConnected) {
        setError("WebSocket이 연결되지 않았습니다.");
        return false;
      }

      try {
        const message = {
          roomId: roomId,
          senderId: userId.toString(),
          senderName: senderName,
          content: content,
          messageType: "TEXT",
        };

        clientRef.current.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify(message),
        });
        return true;
      } catch (error) {
        console.error("메시지 전송 오류:", error);
        setError("메시지 전송에 실패했습니다.");
        return false;
      }
    },
    [roomId, userId, checkConnectionStatus]
  );

  // 사용자 입장
  const joinRoom = useCallback(
    (senderName) => {
      const isStompConnected = checkConnectionStatus();

      if (!clientRef.current || !isStompConnected) {
        return false;
      }

      try {
        const joinMessage = {
          roomId: roomId,
          senderId: userId.toString(),
          senderName: senderName,
          content: "",
          messageType: "JOIN",
        };

        clientRef.current.publish({
          destination: "/app/chat.addUser",
          body: JSON.stringify(joinMessage),
        });
        return true;
      } catch (error) {
        console.error("방 입장 오류:", error);
        return false;
      }
    },
    [roomId, userId, checkConnectionStatus]
  );

  // 연결 해제
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (clientRef.current) {
      clientRef.current.deactivate();
      console.log("WebSocket 연결 해제됨");
      setIsConnected(false);
      clientRef.current = null;
    }
  }, []);

  // 컴포넌트 마운트 시 연결 (userId가 있을 때만)
  useEffect(() => {
    if (userId) {
      connect();
    }

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      disconnect();
    };
  }, [connect, disconnect, userId]);

  // 연결 상태 주기적 확인
  useEffect(() => {
    // 연결이 성공하면 주기적 확인 중단
    if (isConnected) {
      return;
    }

    const interval = setInterval(() => {
      checkConnectionStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, [checkConnectionStatus, isConnected]);

  return {
    isConnected,
    error,
    sendMessage,
    joinRoom,
    disconnect,
  };
};
