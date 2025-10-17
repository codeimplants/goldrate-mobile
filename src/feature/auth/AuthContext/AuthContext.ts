import { createContext } from 'react';
import { RequestOtpResponse, VerifiedUserResponse } from '../services/authservices';
import { RequestOtpResult } from '../services/authservices';
export interface AuthContextInterface {
  id?: number;
  user: any;
  role: string | null;
  otpSent: boolean;
  isAuthenticated: boolean;
  loadingApi: boolean;
  loadingAuth: boolean;
  phoneNumber: string | null;
  hasLoggedOut: boolean;
  biometricFailed: boolean;
  biometricLoading: boolean;

    // Api calls
  requestOtp: (phone: string, force?: boolean) => Promise<RequestOtpResult | undefined>;
  verifyOtp: (otp: string) => Promise<VerifiedUserResponse | undefined>;
  logout: () => void;
  loginWithBiometric: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);
