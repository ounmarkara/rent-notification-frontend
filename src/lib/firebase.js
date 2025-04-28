import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCHveHqKSX0iNIosbIzQoJcFGJXojuPJrk",
  authDomain: "rentnotifications-79e9c.firebaseapp.com",
  projectId: "rentnotifications-79e9c",
  storageBucket: "rentnotifications-79e9c.firebasestorage.app",
  messagingSenderId: "58498901209",
  appId: "1:58498901209:web:f1e1d99a9640b0c3ad8ac8",
  measurementId: "G-87BVTD9B5N",
};

const app = initializeApp(firebaseConfig);
let messaging;
try {
  messaging = getMessaging(app);
} catch (error) {
  console.error("Failed to initialize messaging:", error);
  messaging = null;
}

export async function requestNotificationPermission() {
  if (!messaging) {
    console.error("Messaging not supported in this environment");
    return null;
  }
  try {
    const permission = await Notification.requestPermission();
    console.log("Notification permission status:", permission);
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey:
          "BP5fxfh1gVGoja4dC2ZfpJbcHWqjI5aM5Lc2WQQYMiJC8lj5vsPAOvUNsOMwZ56et3BVhELgj7ViHF8mQyHNJJ4",
      });
      console.log("FCM token:", token);
      return token;
    } else {
      console.log("Notification permission not granted:", permission);
      return null;
    }
  } catch (error) {
    console.error("Error requesting notification permission or token:", error);
    return null;
  }
}

export function onMessageListener(callback) {
  if (!messaging) {
    console.error("Messaging not supported in this environment");
    return;
  }
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);
    // Trigger system notification
    if (Notification.permission === "granted") {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/favicon.ico",
      });
    }
    // Pass to callback for in-app display
    callback(payload);
  });
}

export const initializeFCM = async (onMessageCallback) => {
  const messaging = firebase.messaging();
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await messaging.getToken();
      console.log("FCM Token:", token);
      messaging.onMessage(onMessageCallback);
    }
  } catch (error) {
    console.error("FCM Error:", error);
  }
};

export { messaging };
