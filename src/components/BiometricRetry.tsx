import React, { useState } from "react";
import { Button, Text, View, TouchableOpacity } from "react-native";
import { useAuth } from "../feature/auth/hooks/useAuth";
import { StyleSheet } from "react-native";

export default function BiometricRetry() {
  const { isAuthenticated, loginWithBiometric } = useAuth();
  const [error, setError] = useState("");

  const handleRetry = async () => {
    const success = await loginWithBiometric();
    if (!success) setError("Biometric failed or canceled");
    else setError(""); // success → Navigation updates automatically
  };

  if (isAuthenticated) return null;

  return (
     <View style={styles.container}>
      <Text style={styles.text}>{error || "Biometric authentication required"}</Text>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleRetry}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0f2fe",
  },
  text: {
    color: "#1f2937",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonWrapper: {
    width: "60%",
  },
  button: {
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});