"use client";

import {
  onMessageListener,
  requestNotificationPermission,
} from "@/lib/firebase";
import { useState, useEffect } from "react";
import io from "socket.io-client";

export default function Home() {
  const [notificationStatus, setNotificationStatus] = useState("");
  const [fcmToken, setFcmToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [socketStatus, setSocketStatus] = useState("Disconnected");

  useEffect(() => {
    const socket = io("http://localhost:9092", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      setSocketStatus("Connected");
      console.log("Connected to Socket.IO server");
    });

    socket.on("connectionStatus", (message) => {
      setSocketStatus(message);
      console.log("Socket.IO status:", message);
    });

    socket.on("tokenRegistered", (message) => {
      setNotificationStatus(message);
      console.log("Token registered:", message);
    });

    socket.on("notificationSent", (message) => {
      setNotificationStatus(message);
      console.log("Notification sent:", message);
    });

    socket.on("disconnect", () => {
      setSocketStatus("Disconnected");
      console.log("Disconnected from Socket.IO server");
    });

    const checkAndRequestPermission = async () => {
      if (Notification.permission === "granted") {
        const token = await requestNotificationPermission();
        if (token) {
          setFcmToken(token);
          setNotificationStatus("Notifications enabled");
          registerToken(token);
          socket.emit("registerToken", token);
        } else {
          setNotificationStatus("Failed to get FCM token");
        }
      } else if (Notification.permission === "denied") {
        setNotificationStatus(
          "Notifications are blocked. Please enable them in browser settings for localhost:3000."
        );
      } else {
        setNotificationStatus(
          "To enable notifications, click Allow when prompted or go to browser settings for localhost:3000."
        );
      }
    };

    checkAndRequestPermission();

    onMessageListener((payload) => {
      const notification = payload.notification;
      console.log("In-app notification:", notification);
      setNotifications((prev) => [
        ...prev,
        { id: Date.now(), title: notification.title, body: notification.body },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const registerToken = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/notifications/register-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: 1, fcmToken: token }),
        }
      );
      const result = await response.text();
      setNotificationStatus(result);
    } catch (error) {
      console.error("Error registering token:", error);
      setNotificationStatus("Failed to register token");
    }
  };

  const sendTestReminder = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/notifications/send-rent-reminder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fcmToken,
            tenantName: "John Doe",
            amount: 1000.0,
            dueDate: "2025-04-28",
            reminderType: "Test Reminder",
          }),
        }
      );
      const result = await response.text();
      setNotificationStatus(result);
    } catch (error) {
      console.error("Error sending reminder:", error);
      setNotificationStatus("Failed to send reminder");
    }
  };

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <h1 style={{ color: "#333", marginBottom: "20px" }}>Rent Notification</h1>
      <p style={{ color: "#555", margin: "10px 0" }}>
        Socket.IO Status: {socketStatus}
      </p>
      <p style={{ color: "#555", margin: "10px 0" }}>
        Notification Status: {notificationStatus}
      </p>
      {!fcmToken && (
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
          onClick={async () => {
            const token = await requestNotificationPermission();
            if (token) {
              setFcmToken(token);
              setNotificationStatus("Notifications enabled");
              registerToken(token);
            }
          }}
        >
          Enable Notifications
        </button>
      )}
      {fcmToken && (
        <button
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
          onClick={sendTestReminder}
        >
          Send Test Reminder
        </button>
      )}
      {notifications.length > 0 && (
        <div style={{ marginTop: "20px", width: "100%", maxWidth: "600px" }}>
          <h2 style={{ color: "#333" }}>Notifications</h2>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              style={{
                backgroundColor: "#fff",
                padding: "15px",
                margin: "10px 0",
                borderRadius: "5px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <p style={{ margin: "0", fontWeight: "bold" }}>{notif.title}</p>
              <p style={{ margin: "5px 0 0" }}>{notif.body}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
