import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketManager {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.subscriptions = new Map(); // roomId -> subscription
    this.messageHandlers = new Map(); // roomId -> handler function
    this.error = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // WebSocket 연결
  connect(userId, userInfo = null) {
    if (this.client && this.isConnected) {
      console.log("WebSocket이 이미 연결되어 있습니다.");
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const url = process.env.NEXT_PUBLIC_SOCKJS_URL ?? "http://localhost:8000/ws-stomp";

        // 사용자 정보를 포함한 연결 헤더 설정
        const connectHeaders = {};
        if (userId) {
          connectHeaders["user-id"] = userId.toString();
        }
        if (userInfo) {
          if (userInfo.nickname) {
            connectHeaders["user-name"] = userInfo.nickname;
          } else if (userInfo.name) {
            connectHeaders["user-name"] = userInfo.name;
          } else if (userInfo.loginId) {
            connectHeaders["user-name"] = userInfo.loginId;
          }
        }

        // console.log("STOMP 연결 헤더:", connectHeaders);

        this.client = new Client({
          webSocketFactory: () => {
            return new SockJS(url, null, {
              transports: ["websocket", "xhr-streaming", "xhr-polling"],
              withCredentials: true,
            });
          },
          connectHeaders: connectHeaders,
          debug: (str) => {
            // console.log("STOMP Debug:", str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        this.client.onConnect = (frame) => {
          // console.log("WebSocket 연결 성공! Frame:", frame);
          this.isConnected = true;
          this.error = null;
          this.reconnectAttempts = 0;

          // 기존 구독 복원
          this.restoreSubscriptions();

          resolve();
        };

        this.client.onStompError = (frame) => {
          console.error("STOMP 오류:", frame);
          this.isConnected = false;
          this.error = frame.headers.message || "WebSocket 연결에 실패했습니다.";

          if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`재연결 시도 ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          } else {
            reject(new Error(this.error));
          }
        };

        this.client.onDisconnect = () => {
          console.log("WebSocket 연결 해제됨");
          this.isConnected = false;
          this.client = null;
        };

        this.client.activate();
      } catch (error) {
        console.error("WebSocket 초기화 오류:", error);
        this.error = "WebSocket 초기화에 실패했습니다.";
        reject(error);
      }
    });
  }

  // WebSocket 연결 해제
  disconnect() {
    if (this.client) {
      // 모든 구독 해제
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();
      this.messageHandlers.clear();

      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
      this.error = null;
      console.log("WebSocket 연결 해제됨");
    }
  }

  // 채팅방 구독
  subscribeToRoom(roomId, messageHandler) {
    if (!this.isConnected || !this.client) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return false;
    }

    // 이미 구독 중인 경우 기존 구독 해제
    if (this.subscriptions.has(roomId)) {
      this.subscriptions.get(roomId).unsubscribe();
    }

    try {
      const subscription = this.client.subscribe(`/topic/room.${roomId}`, (message) => {
        try {
          const messageData = JSON.parse(message.body);
          messageHandler(messageData);
        } catch (error) {
          console.log("문자열 메시지 수신:", message.body);
          const stringMessage = {
            content: message.body,
            messageType: "SYSTEM",
            sentAt: new Date().toISOString(),
          };
          messageHandler(stringMessage);
        }
      });

      this.subscriptions.set(roomId, subscription);
      this.messageHandlers.set(roomId, messageHandler);

      console.log(`채팅방 ${roomId} 구독 완료`);
      return true;
    } catch (error) {
      console.error("채팅방 구독 오류:", error);
      return false;
    }
  }

  // 채팅방 구독 해제
  unsubscribeFromRoom(roomId) {
    if (this.subscriptions.has(roomId)) {
      this.subscriptions.get(roomId).unsubscribe();
      this.subscriptions.delete(roomId);
      this.messageHandlers.delete(roomId);
      console.log(`채팅방 ${roomId} 구독 해제`);
    }
  }

  // 메시지 전송
  sendMessage(roomId, senderId, senderName, content) {
    if (!this.isConnected || !this.client) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return false;
    }

    try {
      const message = {
        roomId: roomId,
        senderId: senderId.toString(),
        senderName: senderName,
        content: content,
        messageType: "TEXT",
      };

      this.client.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(message),
      });

      return true;
    } catch (error) {
      console.error("메시지 전송 오류:", error);
      return false;
    }
  }

  // 방 입장
  joinRoom(roomId, senderId, senderName) {
    if (!this.isConnected || !this.client) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return false;
    }

    try {
      const joinMessage = {
        roomId: roomId,
        senderId: senderId.toString(),
        senderName: senderName,
        content: "",
        messageType: "JOIN",
      };

      this.client.publish({
        destination: "/app/chat.addUser",
        body: JSON.stringify(joinMessage),
      });

      return true;
    } catch (error) {
      console.error("방 입장 오류:", error);
      return false;
    }
  }

  // 읽음 처리
  markAsRead(roomId, userId, messageIds) {
    if (!this.isConnected || !this.client) {
      console.error("WebSocket이 연결되지 않았습니다.");
      return false;
    }

    try {
      const readMessage = {
        roomId: roomId,
        userId: userId.toString(),
        messageIds: messageIds, // 읽음 처리할 메시지 ID 배열
        messageType: "READ",
      };

      this.client.publish({
        destination: "/app/chat.markAsRead",
        body: JSON.stringify(readMessage),
      });

      console.log(`읽음 처리 전송: 방 ${roomId}, 사용자 ${userId}, 메시지 ${messageIds.length}개`);
      return true;
    } catch (error) {
      console.error("읽음 처리 오류:", error);
      return false;
    }
  }

  // 기존 구독 복원 (재연결 시)
  restoreSubscriptions() {
    this.messageHandlers.forEach((handler, roomId) => {
      this.subscribeToRoom(roomId, handler);
    });
  }

  // 연결 상태 확인
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      error: this.error,
    };
  }
}

// 싱글톤 인스턴스 생성
const websocketManager = new WebSocketManager();

export default websocketManager;
