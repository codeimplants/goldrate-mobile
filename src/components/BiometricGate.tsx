import React, { useEffect, useState } from "react";
import { Modal, View, ActivityIndicator, StyleSheet, Text, Button } from "react-native";
import { useAuth } from "../feature/auth/hooks/useAuth";
import { checkBiometricAuth } from "../shared/utils/biometricAuth";

interface BiometricGateProps {
  onSuccess: () => void;
}

const BiometricGate: React.FC<BiometricGateProps> = ({ onSuccess }) => {
  const { loadingAuth, isAuthenticated } = useAuth() as any;
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    if (!loadingAuth && isAuthenticated && !isAuthenticating && !visible) {
      setVisible(true);
      runBiometric();
    }
  }, [loadingAuth, isAuthenticated]);

  const runBiometric = async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    setFailed(false);
    const result = await checkBiometricAuth();
    if (result !== null) {
      setVisible(false);
      setIsAuthenticating(false);
      onSuccess(); // Trigger state update in Navigation
    } else {
      setFailed(true);
      setIsAuthenticating(false);
    }
  };

  const handleTryAgain = () => {
    if (!isAuthenticating) {
      runBiometric();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ActivityIndicator />
          <Text style={styles.text}>
            {failed ? "Authentication failed. Try again." : "Confirm your fingerprint"}
          </Text>
          {failed && <Button title="Try Again" onPress={handleTryAgain} disabled={isAuthenticating} />}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center" },
  card: { backgroundColor: "#111", padding: 20, borderRadius: 12, alignItems: "center" },
  text: { marginTop: 10, color: "white" },
});

export default BiometricGate;