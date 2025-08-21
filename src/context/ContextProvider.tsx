import React, { ReactNode } from 'react';
import { AuthProvider } from '../feature/auth/AuthContext/AuthProvider';

const ContextProvider = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default ContextProvider;
