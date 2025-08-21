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
import { StyleSheet, TextInput } from 'react-native';

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const { requestOtp, verifyOtp } = useAuth();

  // refs for OTP inputs
  const otpRefs = Array.from({ length: 4 }).map(() => useRef<TextInput>(null));

  const formik = useFormik({
    initialValues: { phone: '', otp: '' },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required('Phone Number is required')
        .matches(/^\d{10}$/, 'Phone Number should be exactly 10 digits.'),
      otp: Yup.string().when([], {
        is: () => otpSent,
        then: schema =>
          schema
            .required('OTP is required')
            .matches(/^\d{4}$/, 'OTP must be exactly 4 digits'),
      }),
    }),
    onSubmit: async values => {
      setError(null);
      try {
        setLoading(true);
        if (!otpSent) {
          // send otp
          await requestOtp(values.phone);
          setOtpSent(true);
        } else {
          // verify otp
          await verifyOtp(values.otp);
          // ✅ navigate or store token
        }
      } catch (err) {
        setError(
          otpSent ? 'Invalid OTP. Please try again.' : 'Failed to send OTP.',
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleOtpChange = (text: string, index: number) => {
    const otpArray = formik.values.otp.split('');
    otpArray[index] = text;
    const newOtp = otpArray.join('');
    formik.setFieldValue('otp', newOtp);

    // auto move focus
    if (text && index < otpRefs.length - 1) {
      otpRefs[index + 1].current?.focus();
    }

    // move back on delete
    if (!text && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

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

            <Box bg={'white'} width="100%" p={7} mt={-6}>
              {/* Phone Input */}
              <FormControl
                isInvalid={!!formik.errors.phone && formik.touched.phone}
              >
                <Text fontSize={'md'} color="#7d36a0">
                  Phone Number
                </Text>
                <TextInput
                  editable={!otpSent}
                  keyboardType="number-pad"
                  onChangeText={formik.handleChange('phone')}
                  onBlur={formik.handleBlur('phone')}
                  value={formik.values.phone}
                  placeholder="Enter 10-digit phone number"
                  style={[
                    Style.phoneInput,
                    otpSent && { backgroundColor: '#f3f4f6' },
                  ]}
                />
                <FormControl.ErrorMessage>
                  {formik.errors.phone}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* OTP Boxes */}
              {otpSent && (
                <FormControl
                  mt={4}
                  isInvalid={!!formik.errors.otp && formik.touched.otp}
                >
                  <Text fontSize={'md'} color="#7d36a0">
                    Verification Code
                  </Text>
                  <HStack space={3} justifyContent="center">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <TextInput
                        key={i}
                        ref={otpRefs[i]}
                        maxLength={1}
                        editable={otpSent}
                        keyboardType="number-pad"
                        value={formik.values.otp[i] || ''}
                        onChangeText={text => handleOtpChange(text, i)}
                        style={Style.inputFiels}
                      />
                    ))}
                  </HStack>
                  <FormControl.ErrorMessage>
                    {formik.errors.otp}
                  </FormControl.ErrorMessage>
                </FormControl>
              )}

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
                  {otpSent ? 'Submit OTP' : 'Verify & Login'}
                </Button>
              </LinearGradient>

              {/* Change Phone */}
              {otpSent && (
                <Button
                  variant="outline"
                  borderColor="purple.500"
                  borderRadius="lg"
                  _text={{ color: 'purple.600', fontWeight: 'medium' }}
                  mt={4}
                  onPress={() => {
                    setOtpSent(false);
                    formik.resetForm();
                  }}
                >
                  Change Phone Number
                </Button>
              )}

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
  },
});

export default Login;
9112816968;
