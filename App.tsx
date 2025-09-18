import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';  // 👈 import this
import ContextProvider from './src/context/ContextProvider';
import Navigation from './src/navigation/Navigation';
import ErrorBoundary from './src/Error/ErrorBoundary';

export default function App() {
  return (
    <NativeBaseProvider>   {/* 👈 wrap your entire app */}
     <ErrorBoundary>
      <ContextProvider>
        <NavigationContainer>
          <StatusBar
            barStyle="dark-content"
            translucent={false}
            animated={true}
          />
          <Navigation />
        </NavigationContainer>
      </ContextProvider>
      </ErrorBoundary>
    </NativeBaseProvider>
  );
}
