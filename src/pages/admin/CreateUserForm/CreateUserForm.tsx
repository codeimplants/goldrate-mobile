import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  Text,
  ScrollView,
  Card,
  Input,
  Select,
  CheckIcon,
  FormControl,
  TextArea,
} from 'native-base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CreateUserForm: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
    email: Yup.string()
      .email('Invalid email address')
      .optional(),
    role: Yup.string()
      .required('Role is required')
      .oneOf(['ADMIN', 'WHOLESALER', 'RETAILER'], 'Invalid role'),
    wholesalerId: Yup.string().when('role', {
      is: 'RETAILER',
      then: schema => schema.required('Wholesaler ID is required for retailers'),
      otherwise: schema => schema.optional(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      role: '',
      wholesalerId: '',
      notes: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise<void>(resolve => setTimeout(() => resolve(), 1000));
        
        Alert.alert(
          'Success',
          'User created successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to create user. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Full system access and user management';
      case 'WHOLESALER':
        return 'Can manage retailers and update gold rates';
      case 'RETAILER':
        return 'Can view gold rates and place bookings';
      default:
        return '';
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
        <Box flex={1}>
          {/* Header */}
          <LinearGradient
            colors={['#a855f7', '#ec4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingTop: 50,
              paddingBottom: 20,
              paddingHorizontal: 20,
            }}
          >
            <HStack justifyContent="space-between" alignItems="center">
              <HStack alignItems="center" space={3}>
                <Button
                  variant="ghost"
                  _text={{ color: 'white' }}
                  onPress={handleBack}
                  size="sm"
                >
                  ← Back
                </Button>
                <VStack>
                  <Heading size="lg" color="white">
                    Create New User
                  </Heading>
                  <Text color="white" fontSize="sm">
                    Add a new user to the system
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </LinearGradient>

          {/* Form */}
          <ScrollView flex={1} px={4} py={6}>
            <Card bg="white" p={6} borderRadius="xl" shadow={2}>
              <VStack space={4}>
                {/* Name */}
                <FormControl
                  isInvalid={!!formik.errors.name && formik.touched.name}
                >
                  <FormControl.Label>
                    <Text fontWeight="bold" color="gray.700">
                      Full Name *
                    </Text>
                  </FormControl.Label>
                  <Input
                    placeholder="Enter full name"
                    value={formik.values.name}
                    onChangeText={formik.handleChange('name')}
                    onBlur={formik.handleBlur('name')}
                    borderRadius="lg"
                  />
                  <FormControl.ErrorMessage>
                    {formik.errors.name}
                  </FormControl.ErrorMessage>
                </FormControl>

                {/* Phone */}
                <FormControl
                  isInvalid={!!formik.errors.phone && formik.touched.phone}
                >
                  <FormControl.Label>
                    <Text fontWeight="bold" color="gray.700">
                      Phone Number *
                    </Text>
                  </FormControl.Label>
                  <Input
                    placeholder="Enter 10-digit phone number"
                    value={formik.values.phone}
                    onChangeText={formik.handleChange('phone')}
                    onBlur={formik.handleBlur('phone')}
                    keyboardType="numeric"
                    maxLength={10}
                    borderRadius="lg"
                  />
                  <FormControl.ErrorMessage>
                    {formik.errors.phone}
                  </FormControl.ErrorMessage>
                </FormControl>

                {/* Email */}
                <FormControl
                  isInvalid={!!formik.errors.email && formik.touched.email}
                >
                  <FormControl.Label>
                    <Text fontWeight="bold" color="gray.700">
                      Email Address
                    </Text>
                  </FormControl.Label>
                  <Input
                    placeholder="Enter email address (optional)"
                    value={formik.values.email}
                    onChangeText={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                    keyboardType="email-address"
                    borderRadius="lg"
                  />
                  <FormControl.ErrorMessage>
                    {formik.errors.email}
                  </FormControl.ErrorMessage>
                </FormControl>

                {/* Role */}
                <FormControl
                  isInvalid={!!formik.errors.role && formik.touched.role}
                >
                  <FormControl.Label>
                    <Text fontWeight="bold" color="gray.700">
                      Role *
                    </Text>
                  </FormControl.Label>
                  <Select
                    selectedValue={formik.values.role}
                    minWidth="200"
                    accessibilityLabel="Select user role"
                    placeholder="Choose role"
                    _selectedItem={{
                      bg: 'purple.600',
                      endIcon: <CheckIcon size="5" />,
                    }}
                    onValueChange={(value) => {
                      formik.setFieldValue('role', value);
                      if (value !== 'RETAILER') {
                        formik.setFieldValue('wholesalerId', '');
                      }
                    }}
                    borderRadius="lg"
                  >
                    <Select.Item label="Admin" value="ADMIN" />
                    <Select.Item label="Wholesaler" value="WHOLESALER" />
                    <Select.Item label="Retailer" value="RETAILER" />
                  </Select>
                  {formik.values.role && (
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {getRoleDescription(formik.values.role)}
                    </Text>
                  )}
                  <FormControl.ErrorMessage>
                    {formik.errors.role}
                  </FormControl.ErrorMessage>
                </FormControl>

                {/* Wholesaler ID (for retailers) */}
                {formik.values.role === 'RETAILER' && (
                  <FormControl
                    isInvalid={!!formik.errors.wholesalerId && formik.touched.wholesalerId}
                  >
                    <FormControl.Label>
                      <Text fontWeight="bold" color="gray.700">
                        Wholesaler ID *
                      </Text>
                    </FormControl.Label>
                    <Input
                      placeholder="Enter wholesaler ID"
                      value={formik.values.wholesalerId}
                      onChangeText={formik.handleChange('wholesalerId')}
                      onBlur={formik.handleBlur('wholesalerId')}
                      borderRadius="lg"
                    />
                    <FormControl.ErrorMessage>
                      {formik.errors.wholesalerId}
                    </FormControl.ErrorMessage>
                  </FormControl>
                )}

                {/* Notes */}
                <FormControl>
                  <FormControl.Label>
                    <Text fontWeight="bold" color="gray.700">
                      Notes
                    </Text>
                  </FormControl.Label>
                  <Input
  placeholder="Additional notes (optional)"
  value={formik.values.notes}
  onChangeText={formik.handleChange('notes')}
  borderRadius="lg"
/>
                </FormControl>

                {/* Submit Button */}
                <Button
                  bg="purple.600"
                  _text={{ color: 'white', fontWeight: 'bold' }}
                  onPress={()=>formik.handleSubmit()}
                  isLoading={loading}
                  borderRadius="lg"
                  py={3}
                  mt={4}
                >
                  Create User
                </Button>
              </VStack>
            </Card>
          </ScrollView>
        </Box>
      </LinearGradient>
    </SafeAreaProvider>
  );
};

export default CreateUserForm;

