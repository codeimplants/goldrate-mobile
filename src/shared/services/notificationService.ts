import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
// import Config from 'react-native-config';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import { API_BASE ,ONESIGNAL_APP_ID} from '../../constant';
// const API_BASE = Config.API_BASE ;

// Initialize OneSignal
export const initNotifications = () => {
  // Enable verbose logging (remove in production)
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // Initialize with your OneSignal App ID
  OneSignal.initialize(ONESIGNAL_APP_ID);

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
    await axios.post(`${API_BASE}/register-device`, {
      token: playerId, // Use OneSignal playerId
      retailerId,
      wholesalerId,
    });
  } else {
    console.log("User not subscribed to notifications");
  }
};