import { createContext } from 'react';
import { RequestOtpResponse } from '../services/authservices';

export interface AuthContextInterface {
  user: any;
  role: string | null;
  otpSent: boolean;
  isAuthenticated: boolean;
  loadingApi: boolean;
  loadingAuth: boolean;

  // Api calls
  requestOtp: (phone: string) => Promise<RequestOtpResponse | undefined>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);
