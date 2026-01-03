import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box, Button, FormControl, Heading, VStack, Text } from 'native-base';
import Svg, { Path } from 'react-native-svg';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { requestOtp } = useAuth();
  const navigation = useNavigation();

  const getRemainingDigitsText = (length: number) => {
    const remaining = 10 - length;
    if (length === 0) return 'Enter 10-digit phone number';
    if (remaining > 0)
      return `${remaining} more ${
        remaining === 1 ? 'digit' : 'digits'
      } required`;
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
          Alert.alert('Already Logged In', response.message, [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Logout & Continue',
              onPress: async () => {
                const forceResp = await requestOtp(values.phone, true);
                if (forceResp && 'success' in forceResp) {
                  // Alert.alert('OTP Sent', 'Please check your phone');
                  Alert.alert('OTP Sent', `OTP: ${forceResp.info?.otp || 'Check your phone'}`,);
                  navigation.navigate('otp' as never);
                }
              },
            },
 ]);
          return;
        }

        if (response) {
          Alert.alert(
            'OTP Sent',
            `OTP: ${response.info?.otp || 'Check your phone'}`,
          );
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <LinearGradient colors={['#f3e8ff', '#fdf2f8']} style={{ flex: 1 }}>
       
 {/* Back Arrow Button */}
        <Box position="absolute" top={4} left={4} zIndex={1}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('homepage' as never)}
            style={styles.backButton}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 12H5M12 19l-7-7 7-7"
                stroke="#7d36a0"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </Box>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <Box flex={1} justifyContent="center" alignItems="center" px={4}>
              <VStack space={2} w="100%" alignItems="center" >  
                <LinearGradient
                  colors={['#e9d5ff', '#fbcfe8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }} 
                  style={styles.header}
                >
                  <Box py={6}>
                  <Heading size="xl" color="purple.600" textAlign={'center'} mb={2}>
                    Login
                  </Heading>
                  <Text fontSize="sm" color="#8d5bbd">
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
                      isDisabled={formik.values.phone.length !== 10 || loading}
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
                  <Box
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                    }}
                  >
                    <Text style={{ fontSize: 12 }}>New User ? </Text>
                    <TouchableOpacity
                      onPress={() => Linking.openURL('tel:+919850929690')}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: 5,
                      }}
                    >
                      <Text style={{ fontWeight: '600', fontSize: 12 }}>
                      Call us to Sign Up
                    </Text>
                      <Svg
                        width={18}
                        height={18}
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <Path
                          d="M22 16.92V20a2 2 0 01-2.18 2A19.82 19.82 0 013 5.18 2 2 0 015 3h3.09a1 1 0 011 .75 12.84 12.84 0 00.7 2.11 1 1 0 01-.23 1.11L7.91 8.91a16 16 0 008.18 8.18l1.94-1.66a1 1 0 011.11-.23 12.84 12.84 0 002.11.7 1 1 0 01.75 1.02z"
                          fill="purple"
                        />
                      </Svg>
                    </TouchableOpacity>
                  </Box>
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
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
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
   backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

});

export default Login;
