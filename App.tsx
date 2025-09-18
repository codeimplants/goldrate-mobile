import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';  //  import this
import ContextProvider from './src/context/ContextProvider';
import Navigation from './src/navigation/Navigation';
import ErrorBoundary from './src/Error/ErrorBoundary';
import { initNotifications, registerDeviceToken } from './src/shared/services/notificationService';


export default function App() {

useEffect(() => {
        initNotifications();
        registerDeviceToken(10,2);
    }, []);



  return (
    <NativeBaseProvider>   {/*  wrap your entire app */}
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
