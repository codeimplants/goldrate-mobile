import React, { useState } from 'react';
import { StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Button, FormControl, Heading, VStack, Text } from 'native-base';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { requestOtp } = useAuth();
  const navigation = useNavigation();

  const getRemainingDigitsText = (length: number) => {
    const remaining = 10 - length;
    if (length === 0) return 'Enter 10-digit phone number';
    if (remaining > 0) return `${remaining} more ${remaining === 1 ? 'digit' : 'digits'} required`;
    return '✓ Phone number is complete';
  };

  const formik = useFormik({
    initialValues: { phone: '' },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required('Phone Number is required')
        .matches(/^\d{10}$/, 'Phone Number should be exactly 10 digits.'),
    }),
    onSubmit: async values => {
      setError('');
      try {
        setLoading(true);
        const response = await requestOtp(values.phone);

        if (response && 'conflict' in response) {
          Alert.alert(
            'Already Logged In',
            response.message,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Logout & Continue',
                onPress: async () => {
                  const forceResp = await requestOtp(values.phone, true);
                  if (forceResp && 'success' in forceResp) {
                    // Alert.alert('OTP Sent', 'Please check your phone');
                    Alert.alert("OTP Sent", `OTP: ${forceResp.info?.otp || "Check your phone"}`);
                    navigation.navigate('otp' as never);
                  }
                },
              },
            ]
          );
          return;
        }

        if (response) {
          Alert.alert('OTP Sent', `OTP: ${response.info?.otp || 'Check your phone'}`);
          // Alert.alert('OTP Sent. Please check your phone.');
          navigation.navigate('otp' as never);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          Alert.alert('User Not Found', 'Please contact admin to get access.');
        } else if (err.response?.status === 429) {
          Alert.alert('Too Many Requests', 'Try again later.');
        } else {
          setError('Failed to send OTP. Try again.');
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f3e8ff' }}>
      <LinearGradient colors={['#f3e8ff', '#fdf2f8']} style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <Box flex={1} justifyContent="center" alignItems="center" px={4}>
              <VStack space={9} w="100%" alignItems="center" >  
                <LinearGradient
                  colors={['#e9d5ff', '#fbcfe8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }} 
                  style={styles.header}
                >
                  <Box py={5} alignItems="center">
                  <Heading size="xl" color="purple.600" textAlign="center">
                    Login
                  </Heading>
                  <Text fontSize="md" color="#8d5bbd" textAlign="center">
                    Log in to view gold rates and place bookings
                  </Text>
                  </Box>
                </LinearGradient> 
 
                <Box bg="white" width="100%" p={6} borderRadius={12} shadow={2}>
                  <FormControl
                    isInvalid={!!formik.errors.phone && formik.touched.phone}
                  >
                    <Text fontSize="md" color="#7d36a0">
                      Phone Number
                    </Text>
                    <TextInput
                      keyboardType="phone-pad"
                      maxLength={10}
                      onChangeText={text => {
                        const numeric = text.replace(/\D/g, '');
                        formik.setFieldValue('phone', numeric);
                      }}
                      onBlur={formik.handleBlur('phone')}
                      value={formik.values.phone}
                      placeholder="Enter 10-digit phone number"
                      style={[
                        styles.phoneInput,
                        formik.errors.phone && formik.touched.phone
                          ? styles.inputError
                          : formik.values.phone.length === 10
                          ? styles.inputSuccess
                          : null,
                      ]}
                    />

                    {formik.errors.phone && formik.touched.phone ? (
                      <FormControl.ErrorMessage>
                        {formik.errors.phone}
                      </FormControl.ErrorMessage>
                    ) : (
                      <Text style={styles.helperText}>
                        {getRemainingDigitsText(formik.values.phone.length)}
                      </Text>
                    )}
                  </FormControl>

                  <LinearGradient
                    colors={['#a855f7', '#ec4899']}
                    style={styles.buttonWrapper}
                  >
                    <Button
                      onPress={formik.handleSubmit as any}
                      isLoading={loading}
                      bg="transparent"
                      _text={{ color: 'white', fontWeight: 'bold' }}
                    >
                      Send OTP
                    </Button>
                  </LinearGradient>

                  {error && (
                    <Text color="red.500" textAlign="center" mt={2}>
                      {error}
                    </Text>
                  )}
                </Box>
              </VStack>
            </Box>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingVertical: 10, // more vertical padding for notch devices
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 15, // prevent clipping on small screens
  },
  phoneInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    marginTop: 8,
  },
  inputError: {
    borderColor: '#e53e3e',
  },
  inputSuccess: {
    borderColor: '#22c55e',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
  },
  buttonWrapper: {
    borderRadius: 8,
    marginTop: 20,
  },
});

export default Login;
