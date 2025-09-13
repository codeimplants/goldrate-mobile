import EncryptedStorage from "react-native-encrypted-storage";
import ReactNativeBiometrics from "react-native-biometrics";

export async function saveLoginSession(token: string, user: any) {
  await EncryptedStorage.setItem("auth_token", token);
  await EncryptedStorage.setItem("user", JSON.stringify(user));
  await EncryptedStorage.setItem("biometricEnabled", "true");
}

export async function checkBiometricAuth(): Promise<{ user: any; token: string } | null> {
  try {
    const biometricEnabled = await EncryptedStorage.getItem("biometricEnabled");
    const token = await EncryptedStorage.getItem("auth_token");
    const storedUser = await EncryptedStorage.getItem("user");

    console.log("🔍 biometricEnabled:", biometricEnabled);
    console.log("🔍 token:", token ? "Token exists" : "No token");
    console.log("🔍 storedUser:", storedUser ? "User exists" : "No user");

    if (biometricEnabled && token && storedUser) {
      const rnBiometrics = new ReactNativeBiometrics();
      const { success, error } = await rnBiometrics.simplePrompt({
        promptMessage: "Login with fingerprint",
      });

      console.log("🔍 Biometric result:", { success, error });

      if (success) {
        console.log("✅ Biometric auth success");
        return { user: JSON.parse(storedUser), token };
      } else {
        console.log("❌ Biometric failed:", error || "User canceled or authentication failed");
        return null;
      }
    }
    console.log("⚠️ Missing biometric data, token, or user");
    return null;
  } catch (e) {
    console.error("Biometric error:", e);
    return null;
  }
}