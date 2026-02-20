importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC57OazOqcOQWP4aIjUmhV3pmJl2aUyINE",
  authDomain: "chatnova-gs-ab31a.firebaseapp.com",
  projectId: "chatnova-gs-ab31a",
  messagingSenderId: "91924224066",
  appId: "1:91924224066:web:e21cddf4ebd1ab3eebb5db",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo192.png",
  });
});