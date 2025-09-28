import React, { useEffect, useState } from "react";
import { Box, Button, Text, VStack } from "native-base";
import { checkBiometricAuth } from "../shared/utils/biometricAuth";
import { useAuth } from "../feature/auth/hooks/useAuth";

const BiometricGate = () => {
  const { setAuthFromBiometric } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleBiometric = async () => {
    setError(null);
    const data = await checkBiometricAuth();
    if (data) {
      setAuthFromBiometric(data.user, data.token);
    } else {
      setError("Biometric authentication failed or canceled");
    }
  };

  useEffect(() => {
    handleBiometric();
  }, []);

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      {error ? (
        <VStack space={4} alignItems="center">
          <Text>{error}</Text>
          <Button onPress={handleBiometric}>Try Again</Button>
          <Button variant="outline" onPress={() => {/* navigate to OTP */}}>
            Use OTP Instead
          </Button>
        </VStack>
      ) : (
        <Text>Authenticating...</Text>
      )}
    </Box>
  );
};

export default BiometricGate;
