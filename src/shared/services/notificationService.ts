import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { OneSignal, LogLevel } from 'react-native-onesignal';
import { API_BASE, ONESIGNAL_APP_ID } from '../../constant';

// Initialize OneSignal
export const initNotifications = () => {
  console.log("🔹 Initializing OneSignal...");

  // Enable verbose logging (remove in production)
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // Initialize with your OneSignal App ID
  OneSignal.initialize(ONESIGNAL_APP_ID);
  console.log("🔹 OneSignal initialized with App ID:", ONESIGNAL_APP_ID);

  // Request permission to send notifications
  OneSignal.Notifications.requestPermission(true);
  console.log("🔹 Requested notification permission");

  // Listen for push subscription changes (token + playerId)
  OneSignal.User.pushSubscription.addEventListener("change", (state) => {
    console.log("📢 Push subscription changed:", state);

    console.log("📲 Player ID:", state.current.id);
    console.log("🔑 Push Token (FCM/APNs):", state.current.token);
    console.log("✅ Subscribed:", state.current.optedIn);

    if (!state.current.optedIn) {
      console.warn("⚠️ Device is not subscribed! Notifications will fail.");
    }
  });

  // Foreground notification handler
  OneSignal.Notifications.addEventListener("foregroundWillDisplay", event => {
    const notification = event.getNotification();
    console.log("🔔 Foreground notification received: ", notification);

    // Decide whether to show or not
    event.preventDefault(); 
    notification.display(); // show the notification
  });

  // When notification is clicked / opened
  OneSignal.Notifications.addEventListener("click", event => {
    console.log("📥 Notification opened: ", event);
  });
};

// Get OneSignal player ID & register with backend
export const registerDeviceToken = async (userId:number) => {
  console.log("🔹 Registering device token for user:", userId);

  try {
    const playerId = await OneSignal.User.pushSubscription.getIdAsync();
    console.log("🔹 Retrieved Player ID from service! :", playerId);

    if (!playerId) {
      console.warn("⚠️ User not subscribed to notifications (no playerId yet)");
      return;
    }

        console.log("📲!! Final Player ID retrieved:", playerId)
    // Send to backend
    const response = await axios.post(`${API_BASE}/register-device`, {
      token: playerId, // You’re storing Player ID, which is correct
      userId,
    });

    console.log("✅ Device token registered on backend:", response.data);
  } catch (error) {
    if (typeof error === "object" && error !== null && "response" in error && typeof (error as any).response === "object") {
      console.error("❌ Failed to register device token:", (error as any).response?.data || (error as any).message);
    } else {
      console.error("❌ Failed to register device token:", (error as any)?.message || error);
    }
  }
};




  // Place this in your notification service or API utility
export const clearDeviceToken = async (userId: number) => {
  try {
    const response = await axios.post(`${API_BASE}/clear-device-token`, { userId });
    console.log("🗑 Device token cleared:", response.data);
  } catch (error: any) {
    console.error("❌ Failed to clear device token:", error.response?.data || error.message);
  }
};