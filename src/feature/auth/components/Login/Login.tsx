import { useFormik } from 'formik';
import {
  Box,
  Button,
  FormControl,
  Heading,
  VStack,
  Text,
  HStack,
} from 'native-base';
import React, { useState, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);
  const [phoneError, setPhoneError] = useState<string>("");

  const { requestOtp } = useAuth();
  const navigation = useNavigation();

  // Helper function to get remaining digits text
  const getRemainingDigitsText = (currentLength: number) => {
    const remaining = 10 - currentLength;
    if (currentLength === 0) {
      return 'Enter 10-digit phone number';
    } else if (remaining > 0) {
      return `${remaining} more ${remaining === 1 ? 'digit' : 'digits'} required`;
    } else if (currentLength === 10) {
      return '✓ Phone number is complete';
    }
    return '';
  };

  // Validate phone number
  const validatePhone = (text: string) => {
    if (text.length === 0) {
      setPhoneError("");
    } else if (text.length < 10) {
      setPhoneError("");
    } else if (text.length === 10) {
      setPhoneError("");
    }
  };

  const formik = useFormik({
    initialValues: { phone: '' },    validationSchema: Yup.object({
      phone: Yup.string()
        .required('Phone Number is required')
        .matches(/^\d{10}$/, 'Phone Number should be exactly 10 digits.'),
    }),onSubmit: async values => {
      setError(null);
      try {
        setLoading(true);
        const response = await requestOtp(values.phone);

        if (response && "conflict" in response) {
          Alert.alert(
            "Already Logged In",
            response.message,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Logout & Continue",
                onPress: async () => {
                  const forceResp = await requestOtp(values.phone, true);
                  if (forceResp && "success" in forceResp) {
                    Alert.alert("OTP Sent", `OTP: ${forceResp.info?.otp || "Check your phone"}`);
                    navigation.navigate("otp" as never);
                  }
                },
              },
            ],
            { cancelable: true }
          );
          return;
        }

        if (response) {
          // Alert.alert('OTP Sent', `OTP: ${response.info?.otp || 'Check your phone'}`);
          Alert.alert('OTP Sent. Please check your phone.');
          navigation.navigate('otp' as never);
        }  
          } catch (err: any) {
        // Check if it's a 404 error (user not found)
        if (err.response?.status === 404) {
          const serverMessage = err.response?.data?.message || 'User not found. Please contact your Admin or Wholesaler to be added.';
          Alert.alert("User Not Found", serverMessage);
        } else if (err.response?.status === 429) {
          // Rate limit error
          const serverMessage = err.response?.data?.message || 'Too many OTP requests. Please try again later.';
          Alert.alert("Too Many Requests", serverMessage);
        } else {
          setError('Failed to send OTP. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    },
  });



  return (
    <SafeAreaProvider>
      <LinearGradient
        colors={['#f3e8ff', '#fdf2f8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <Box flex={1} justifyContent="center" alignItems="center">
          <VStack space={6} w="100%" alignItems="center">
            <LinearGradient
              colors={['#e9d5ff', '#fbcfe8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: '100%',
                height: 120,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 0,
              }}
            >
              <Box mb={0}>
                <Heading size="xl" textAlign={'center'} color="purple.600">
                  Login
                </Heading>
                <Text fontSize="md" color="#8d5bbd" textAlign="center">
                  Log in to view gold rates and place bookings
                </Text>
              </Box>
            </LinearGradient>

            <Box bg={'white'} width="100%" p={7} mt={-6}>              {/* Phone Input */}
              <FormControl
                isInvalid={!!formik.errors.phone && formik.touched.phone}
              >
                <Text fontSize={'md'} color="#7d36a0">
                  Phone Number
                </Text>
                <TextInput
                  keyboardType="phone-pad"
                  maxLength={10}
                  onChangeText={(text) => {
                    const numericText = text.replace(/\D/g, "");
                    formik.setFieldValue('phone', numericText);
                    validatePhone(numericText);
                  }}
                  onBlur={formik.handleBlur('phone')}
                  value={formik.values.phone}
                  placeholder="Enter 10-digit phone number"
                  style={[
                    Style.phoneInput,
                    phoneError ? Style.inputError : null,
                    formik.values.phone.length === 10 ? Style.inputSuccess : null
                  ]}
                />
                  {/* Helper text for remaining digits */}
                {!phoneError && !formik.errors.phone && !formik.touched.phone ? (
                  <Text style={[
                    Style.helperText,
                    formik.values.phone.length === 10 ? Style.successText : Style.normalText
                  ]}>
                    {getRemainingDigitsText(formik.values.phone.length)}
                  </Text>
                ) : formik.errors.phone && formik.touched.phone ? (
                  <FormControl.ErrorMessage>
                    {formik.errors.phone}
                  </FormControl.ErrorMessage>
                ) : (
                  <Text style={[
                    Style.helperText,
                    formik.values.phone.length === 10 ? Style.successText : Style.normalText
                  ]}>
                    {getRemainingDigitsText(formik.values.phone.length)}
                  </Text>
                )}
              </FormControl>

              {/* Submit Button */}
              <LinearGradient
                colors={['#a855f7', '#ec4899']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  borderRadius: 7,
                  width: '100%',
                  marginTop: '6%',
                }}
              >
                <Button
                  onPress={formik.handleSubmit as any}
                  isLoading={loading}
                  borderRadius="lg"
                  px={8}
                  py={3}
                  bg="transparent"
                  _text={{
                    fontSize: 'md',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  Send OTP
                </Button>
              </LinearGradient>



              {error && (
                <Text color="red.500" fontSize="sm" textAlign="center">
                  {error}
                </Text>
              )}
            </Box>
          </VStack>
        </Box>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

const Style = StyleSheet.create({
  inputFiels: {
    width: 45,
    height: 55,
    borderRadius: 8,
    borderColor: '#a855f7',
    borderWidth: 1.5,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'white',
    color: '#1f2937',
  },
  phoneInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  inputError: {
    borderColor: '#e53e3e',
  },
  inputSuccess: {
    borderColor: '#22c55e',
  },
  helperText: {
    fontSize: 12,
    marginTop: 2,
    marginLeft: 4,
  },
  normalText: {
    color: '#888',
  },
  successText: {
    color: '#22c55e',
    fontWeight: '600',
  },
  errorText: {
    color: '#e53e3e',
    fontSize: 12,
    marginTop: 2,
    marginLeft: 4,
  },
});

export default Login;
