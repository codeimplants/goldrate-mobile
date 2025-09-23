import { useEffect } from "react";
import { initNotifications } from "../services/notificationService";

export default function NotificationInitializer() {
  useEffect(() => {
    initNotifications(); // initialize OneSignal listeners only
  }, []);

  return null;
}
