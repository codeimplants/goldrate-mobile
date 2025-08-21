import axios from 'axios';

// ==== Response Types ====

export interface RequestOtpResponse {
  success: boolean;
  msg?: string;
}

export interface VerifiedUserResponse {
  token: string;
  success: boolean;
  user: {
    _id: string;
    phone?: string;
    email?: string;
    createdAt?: string;
  };
}

// ==== API Calls ====

// Request OTP
export const requestOtpOnPhone = async (
  mobile: string,
): Promise<RequestOtpResponse> => {
  console.log(mobile, typeof mobile);

  const response = await axios.post(
    'https://broadcast-info-be.onrender.com/api/auth/send-otp',
    { mobile: mobile },
  );
  console.log(`OTP requested for mobile: ${mobile}`);
  return response.data as RequestOtpResponse;
};

// Verify OTP
export const verifyOtpFromPhone = async (
  mobile: string,
  otp: string,
): Promise<VerifiedUserResponse | null> => {
  try {
    const response = await axios.post(
      'https://broadcast-info-be.onrender.com/api/auth/verify-otp',
      {
        mobile: mobile,
        otp: otp,
      },
    );
    console.log(response);

    console.log(response.data);

    if (response.status === 200) {
      return response.data as VerifiedUserResponse;
    }
    return null;
  } catch (error) {
    console.error('Error verifying phone OTP:', error);
    return null;
  }
};
