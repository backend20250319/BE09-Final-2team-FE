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
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const url = process.env.NEXT_PUBLIC_WEBSOCKET_URL ?? "http://localhost:8000/ws-stomp";

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

        // 토큰 기반 인증을 위한 설정
        const accessToken = localStorage.getItem("user-storage")
          ? JSON.parse(localStorage.getItem("user-storage")).state?.accessToken
          : null;

        if (accessToken) {
          connectHeaders["Authorization"] = `Bearer ${accessToken}`;
        }
        connectHeaders["X-Requested-With"] = "XMLHttpRequest";

        this.client = new Client({
          webSocketFactory: () => {
            return new SockJS(url, null, {
              transports: ["websocket", "xhr-streaming", "xhr-polling"],
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
          } else {
            reject(new Error(this.error));
          }
        };

        this.client.onDisconnect = () => {
          this.isConnected = false;
          this.client = null;
        };

        this.client.activate();
      } catch (error) {
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
    }
  }

  // 메시지 전송
  sendMessage(roomId, senderId, senderName, content) {
    if (!this.isConnected || !this.client) {
      console.error("WebSocket이 연결되지 않았습니다.", {
        isConnected: this.isConnected,
        hasClient: !!this.client,
        error: this.error,
      });
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

      // ✅ 로컬스토리지에서 accessToken 가져오기
      const accessToken = localStorage.getItem("user-storage")
        ? JSON.parse(localStorage.getItem("user-storage")).state?.accessToken
        : null;

      // 사용자 정보를 헤더에 포함
      const headers = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      if (senderId) {
        headers["user-id"] = senderId.toString();
      }
      if (senderName) {
        headers["user-name"] = senderName;
      }

      this.client.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(message),
        headers: headers,
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

      // ✅ 로컬스토리지에서 accessToken 가져오기
      const accessToken = localStorage.getItem("user-storage")
        ? JSON.parse(localStorage.getItem("user-storage")).state?.accessToken
        : null;

      // 사용자 정보를 헤더에 포함
      const headers = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      if (senderId) {
        headers["user-id"] = senderId.toString();
      }
      if (senderName) {
        headers["user-name"] = senderName;
      }

      this.client.publish({
        destination: "/app/chat.addUser",
        body: JSON.stringify(joinMessage),
        headers: headers,
      });

      return true;
    } catch (error) {
      console.error("방 입장 오류:", error);
      return false;
    }
  }

  /*
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

      return true;
    } catch (error) {
      console.error("읽음 처리 오류:", error);
      return false;
    }
  }
  */

  // 기존 구독 복원 (재연결 시)
  restoreSubscriptions() {
    this.messageHandlers.forEach((handler, roomId) => {
      this.subscribeToRoom(roomId, handler);
    });
  }

  // 연결 상태 확인
  getConnectionStatus() {
    // STOMP 클라이언트의 실제 연결 상태도 확인
    const actualConnected = this.client && this.client.connected && this.client.active;

    const status = {
      isConnected: this.isConnected && actualConnected,
      error: this.error,
      hasClient: !!this.client,
      reconnectAttempts: this.reconnectAttempts,
      actualConnected: actualConnected,
    };

    return status;
  }

  // 연결 강제 재시도
  async forceReconnect(userId, userInfo = null) {
    this.disconnect();
    this.reconnectAttempts = 0;
    return this.connect(userId, userInfo);
  }
}

// 싱글톤 인스턴스 생성
const websocketManager = new WebSocketManager();

export default websocketManager;
