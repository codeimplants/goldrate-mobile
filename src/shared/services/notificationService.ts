import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { OneSignal, LogLevel } from 'react-native-onesignal';

const BACKEND_URL = "http://192.168.1.103:3000"; // replace with your backend

// Initialize OneSignal
export const initNotifications = () => {
  // Enable verbose logging (remove in production)
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // Initialize with your OneSignal App ID
  OneSignal.initialize("a09e038e-638f-4d66-9946-fff45f453136");

  // Request permission to send notifications
  OneSignal.Notifications.requestPermission(true);

  // Foreground notification handler
  OneSignal.Notifications.addEventListener("foregroundWillDisplay", event => {
    const notification = event.getNotification();
    console.log("Foreground notification: ", notification);

    // Decide whether to show or not
    event.preventDefault(); 
    notification.display(); // show the notification
  });

  // When notification is clicked / opened
  OneSignal.Notifications.addEventListener("click", event => {
    console.log("Notification opened: ", event);
  });
};

// Get OneSignal player ID & register with backend
export const registerDeviceToken = async (retailerId: number, wholesalerId: number) => {
  const playerId = await OneSignal.User.pushSubscription.getIdAsync();

  if (playerId) {
    console.log("📲 OneSignal Player ID:", playerId);

    // Send to backend
    await axios.post(`${BACKEND_URL}/register-device`, {
      token: playerId, // Use OneSignal playerId
      retailerId,
      wholesalerId,
    });
  } else {
    console.log("User not subscribed to notifications");
  }
};