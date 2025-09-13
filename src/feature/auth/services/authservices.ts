import apiClient from '../../../shared/services/apiClient';

// ==== Response Types ====

export interface RequestOtpResponse {
  success: boolean;
  msg?: string;
  info?: {
    otp: string;
  };
}

export interface VerifiedUserResponse {
  token: string;
  success: boolean;
  user: {
    id: string;
    _id?: string;
    phone?: string;
    email?: string;
    role: string;
    wholesalerId?: string;
    createdAt?: string;
  };
}

// ==== API Calls ====

// Request OTP
export const requestOtpOnPhone = async (
  mobile: string,
): Promise<RequestOtpResponse> => {
  console.log(mobile, typeof mobile);

  const response = await apiClient.post('/api/auth/send-otp', { mobile });
  console.log(`OTP requested for mobile: ${mobile}`);
  return response.data as RequestOtpResponse;
};

// Verify OTP
export const verifyOtpFromPhone = async (
  mobile: string,
  otp: string,
): Promise<VerifiedUserResponse> => {
  try {
    const response = await apiClient.post('/api/auth/verify-otp', {
      mobile,
      otp,
    });
    console.log('OTP Verification Response:', response.data);

    if (response.status === 200) {
      return response.data as VerifiedUserResponse;
    }

    
    return response.data as VerifiedUserResponse;
  } catch (error) {
    console.error('Error verifying phone OTP:', error);
    throw error;
  }
};
