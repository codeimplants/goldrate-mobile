import { createContext } from 'react';
import { RequestOtpResponse, VerifiedUserResponse } from '../services/authservices';

export interface AuthContextInterface {
  user: any;
  role: string | null;
  otpSent: boolean;
  isAuthenticated: boolean;
  loadingApi: boolean;
  loadingAuth: boolean;
  phoneNumber: string | null;

  // Api calls
  requestOtp: (phone: string) => Promise<RequestOtpResponse | undefined>;
  verifyOtp: (otp: string) => Promise<VerifiedUserResponse | undefined>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);
