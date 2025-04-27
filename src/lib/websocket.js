import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export function connectWebSocket(onMessageReceived, onConnectionChange) {
  try {
    const socketUrl = "http://localhost:8080/ws";
    const socket = new SockJS(socketUrl);
    if (!socket) {
      throw new Error("Failed to create SockJS socket");
    }

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log("STOMP: " + str);
      },
    });

    stompClient.onConnect = () => {
      console.log("WebSocket connected");
      onConnectionChange({ status: "connected" });
      stompClient.subscribe("/topic/notifications", (message) => {
        try {
          const notification = JSON.parse(message.body);
          onMessageReceived(notification);
        } catch (err) {
          console.error("Error parsing notification:", err);
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP error:", frame);
      onConnectionChange({ status: "error", error: frame });
    };

    stompClient.onWebSocketClose = () => {
      console.log("WebSocket disconnected");
      onConnectionChange({ status: "disconnected" });
    };

    stompClient.onWebSocketError = (error) => {
      console.error("WebSocket error:", error);
      onConnectionChange({ status: "error", error: error.message });
    };

    stompClient.activate();

    return stompClient;
  } catch (err) {
    console.error("WebSocket initialization error:", err);
    onConnectionChange({ status: "error", error: err.message });
    return null;
  }
}

export function disconnectWebSocket(stompClient) {
  if (stompClient) {
    try {
      stompClient.deactivate();
      console.log("WebSocket disconnected");
    } catch (err) {
      console.error("Error disconnecting WebSocket:", err);
    }
  }
}
