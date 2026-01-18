/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.x.x/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY_HERE", // Replace/Inject during build
    authDomain: "gaugyan-2f059.firebaseapp.com",
    projectId: "gaugyan-2f059",
    storageBucket: "gaugyan-2f059.firebasestorage.app",
    messagingSenderId: "784847571076",
    appId: "1:784847571076:web:742bd5747b3ed6bdc4dad1",
    measurementId: "G-4W9YE36X3H"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/gaugyan-logo.png' // Ensure this exists in public folder
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
