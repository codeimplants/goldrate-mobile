import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  Heading,
  VStack,
  Text,
  HStack,
} from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { saveLoginSession } from '../../../../shared/utils/biometricAuth';

const OtpScreen: React.FC = () => {
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);

  const { verifyOtp, requestOtp, phoneNumber } = useAuth();
  const navigation = useNavigation();
  const otpRefs = Array.from({ length: 6 }).map(() => useRef<TextInput>(null));

  useEffect(() => {
    if (!phoneNumber) return;
    const cooldownEnd = Date.now() + 30 * 1000;
    setCooldown(30);

    const interval = setInterval(() => {
      const timeLeft = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
      setCooldown(timeLeft);
      if (timeLeft <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [phoneNumber]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = otp.split('');
    if (text.length > 1) {
      const digits = text.replace(/\D/g, '').slice(0, 6);
      const fullOtp = Array(6).fill('');
      digits.split('').forEach((d, i) => {
        if (index + i < 6) fullOtp[index + i] = d;
      });
      setOtp(fullOtp.join(''));
      const nextIndex = Math.min(index + digits.length, 5);
      otpRefs[nextIndex].current?.focus();
      return;
    }

    if (text.length === 1 && /^\d$/.test(text)) {
      newOtp[index] = text;
      if (index < otpRefs.length - 1) otpRefs[index + 1].current?.focus();
    } else if (text.length === 0) {
      newOtp[index] = '';
    }
    setOtp(newOtp.join(''));
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace') {
      const newOtp = otp.split('');
      if (newOtp[index]) {
        newOtp[index] = '';
      } else if (index > 0) {
        newOtp[index - 1] = '';
        otpRefs[index - 1].current?.focus();
      }
      setOtp(newOtp.join(''));
    }
  };

  const handleFocus = (index: number) => {
    const firstEmptyIndex = otp.split('').findIndex(d => !d);
    if (firstEmptyIndex !== -1 && firstEmptyIndex < index) {
      otpRefs[firstEmptyIndex].current?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await verifyOtp(otp);
      if (result) {
        await saveLoginSession(result.token, result.user);
        Alert.alert('Success', 'Login successful!');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0 || !phoneNumber) return;
    setLoading(true);
    setError(null);
    try {
      await requestOtp(phoneNumber);
      Alert.alert('OTP Sent', 'A new OTP has been sent to your phone.');
      const cooldownEnd = Date.now() + 30 * 1000;
      setCooldown(30);
      const interval = setInterval(() => {
        const timeLeft = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
        setCooldown(timeLeft);
        if (timeLeft <= 0) clearInterval(interval);
      }, 1000);
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={['#f3e8ff', '#fdf2f8']} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
            <Box flex={1} justifyContent="center" alignItems="center" px={6} py={8}>
              <VStack space={6} w="100%" alignItems="center"> 
                <LinearGradient
                  colors={['#e9d5ff', '#fbcfe8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.headerGradient}
                >
                  <Box>
                    <Heading size="xl" textAlign="center" color="purple.600">
                      Verify OTP
                    </Heading>
                    <Text fontSize="md" color="#8d5bbd" textAlign="center" mt={2}>
                      Enter the 6-digit code sent to {phoneNumber}
                    </Text>
                  </Box>
                </LinearGradient>
 
                <Box bg="white" width="100%" p={6} borderRadius="xl">
                  <FormControl isInvalid={!!error}>
                    <Text fontSize="md" color="#7d36a0" mb={3}>
                      Verification Code
                    </Text>
                    <HStack space={2} justifyContent="center">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <TextInput
                          key={i}
                          ref={otpRefs[i]}
                          maxLength={1}
                          keyboardType="number-pad"
                          value={otp[i] || ''}
                          onChangeText={text => handleOtpChange(text, i)}
                          onKeyPress={event => handleKeyPress(event, i)}
                          onFocus={() => handleFocus(i)}
                          style={styles.otpInput}
                          selectTextOnFocus
                        />
                      ))}
                    </HStack>
                    {error && (
                      <FormControl.ErrorMessage mt={2}>
                        {error}
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>

                  {/* Verify Button */}
                  <LinearGradient
                    colors={['#a855f7', '#ec4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Button
                      onPress={handleVerifyOtp}
                      isLoading={loading}
                      borderRadius="lg"
                      bg="transparent"
                      _text={{ fontSize: 'md', fontWeight: 'bold', color: 'white' }}
                    >
                      Verify & Login
                    </Button>
                  </LinearGradient>

                  {/* Resend OTP */}
                  <Button
                    variant="outline"
                    borderColor="purple.500"
                    borderRadius="lg"
                    _text={{ color: 'purple.600', fontWeight: 'medium' }}
                    mt={4}
                    onPress={handleResendOtp}
                    isDisabled={cooldown > 0 || loading}
                  >
                    {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend OTP'}
                  </Button>

                  {/* Change Number */}
                  <Button
                    variant="ghost"
                    _text={{ color: 'purple.600', fontWeight: 'medium' }}
                    mt={2}
                    onPress={handleChangeNumber}
                  >
                    Change Phone Number
                  </Button>
                </Box>
              </VStack>
            </Box>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    width: '100%',
    paddingVertical: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderRadius: 8,
    borderColor: '#a855f7',
    borderWidth: 1.5,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'white',
    color: '#1f2937',
  },
  buttonGradient: {
    borderRadius: 10,
    width: '100%',
    marginTop: 20,
  },
});

export default OtpScreen;
