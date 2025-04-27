importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyCHveHqKSX0iNIosbIzQoJcFGJXojuPJrk",
  authDomain: "rentnotifications-79e9c.firebaseapp.com",
  projectId: "rentnotifications-79e9c",
  storageBucket: "rentnotifications-79e9c.firebasestorage.app",
  messagingSenderId: "58498901209",
  appId: "1:58498901209:web:f1e1d99a9640b0c3ad8ac8",
  measurementId: "G-87BVTD9B5N",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
