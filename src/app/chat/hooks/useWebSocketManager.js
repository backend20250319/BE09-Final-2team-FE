import { useState, useEffect, useCallback } from "react";
import websocketManager from "../../../lib/websocketManager";
import { useUser } from "../../../store/userStore";

export const useWebSocketManager = (roomId, onMessageReceived) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const user = useUser();

  // 연결 상태 동기화
  useEffect(() => {
    let interval = null;

    const updateConnectionStatus = () => {
      const status = websocketManager.getConnectionStatus();

      // 연결이 끊어진 경우 재연결 시도
      if (!status.isConnected && status.hasClient && user?.id) {
        websocketManager.forceReconnect(user.id, user).catch((error) => {
          console.error("WebSocket 재연결 실패:", error);
        });
      }

      setIsConnected(status.isConnected);
      setError(status.error);

      // 연결이 성공하면 주기적 확인 중단
      if (status.isConnected && interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    // 초기 상태 설정
    updateConnectionStatus();

    // 연결이 안 된 경우에만 주기적으로 상태 확인 (3초마다)
    if (!isConnected) {
      interval = setInterval(updateConnectionStatus, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [user]);

  // 연결 상태가 변경될 때 주기적 확인 재시작/중단
  useEffect(() => {
    let interval = null;

    const startPeriodicCheck = () => {
      if (!isConnected && user?.id) {
        interval = setInterval(() => {
          const status = websocketManager.getConnectionStatus();
          if (!status.isConnected && status.hasClient) {
            websocketManager.forceReconnect(user.id, user).catch((error) => {
              console.error("WebSocket 재연결 실패:", error);
            });
          }
        }, 3000);
      }
    };

    startPeriodicCheck();

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isConnected, user]);

  // 채팅방 구독
  const subscribeToRoom = useCallback(() => {
    if (!roomId || !user?.id) {
      return false;
    }

    return websocketManager.subscribeToRoom(roomId, onMessageReceived);
  }, [roomId, user?.id, onMessageReceived]);

  // 채팅방 구독 해제
  const unsubscribeFromRoom = useCallback(() => {
    if (roomId) {
      websocketManager.unsubscribeFromRoom(roomId);
    }
  }, [roomId]);

  // 메시지 전송
  const sendMessage = useCallback(
    (content, senderName) => {
      if (!roomId || !user?.id) {
        setError("채팅방 정보가 없습니다.");
        return false;
      }

      return websocketManager.sendMessage(roomId, user.id, senderName, content);
    },
    [roomId, user?.id]
  );

  // 방 입장
  const joinRoom = useCallback(
    (senderName) => {
      if (!roomId || !user?.id) {
        return false;
      }

      return websocketManager.joinRoom(roomId, user.id, senderName);
    },
    [roomId, user?.id]
  );

  /*
  // 읽음 처리
  const markAsRead = useCallback(
    (messageIds) => {
      if (!roomId || !user?.id) {
        return false;
      }

      return websocketManager.markAsRead(roomId, user.id, messageIds);
    },
    [roomId, user?.id]
  );
  */

  // 컴포넌트 마운트 시 채팅방 구독
  useEffect(() => {
    if (isConnected && roomId && user?.id) {
      subscribeToRoom();
    }
  }, [isConnected, roomId, user?.id, subscribeToRoom]);

  // 컴포넌트 언마운트 시 채팅방 구독 해제
  useEffect(() => {
    return () => {
      unsubscribeFromRoom();
    };
  }, [unsubscribeFromRoom]);

  return {
    isConnected,
    error,
    sendMessage,
    joinRoom,
    // markAsRead,
  };
};
