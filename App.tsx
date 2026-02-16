import React, { use, useContext, useEffect, useState } from 'react';
import { BackHandler, Linking, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Box, NativeBaseProvider } from 'native-base';  //  import this
import ContextProvider from './src/context/ContextProvider';
import Navigation from './src/navigation/Navigation';
import ErrorBoundary from './src/Error/ErrorBoundary';
import NotificationInitializer from './src/shared/services/NotificationInitializer';
import { getDecision } from './src/version-control/sdk';
import type { VCDecision } from '@codeimplants/version-control';
import ForceUpdateModal from './src/version-control/Pages/ForceUpdateModal';
import MaintenanceModal from './src/version-control/Pages/MaintenanceModal';
import SoftUpdateModal from './src/version-control/Pages/SoftUpdateModal';


export default function App() {
  const [soft, setSoft] = useState<boolean>(false);
  const [force, setForce] = useState<boolean>(false);
  const [maintenance, setMaintenance] = useState<boolean>(false);
  const [storeUrl, setStoreUrl] = useState<string>("");
  const [decision, setDecision] = useState<VCDecision | null>(null);

  useEffect(() => {
    getDecision().then((decision: VCDecision) => setDecision(decision));
  }, []);

  useEffect(() => {
    if (!decision) return;

    if (decision.action === "FORCE_UPDATE") {
      setForce(true);
      if (decision.storeUrl) setStoreUrl(decision.storeUrl);
    } else if (decision.action === "SOFT_UPDATE") {
      setSoft(true);
      if (decision.storeUrl) setStoreUrl(decision.storeUrl);
    } else if (decision.action === "MAINTENANCE") {
      setMaintenance(true);
    } else if (decision.action === "KILL_SWITCH") {
      setForce(true);
    } else {
      setForce(false);
      setSoft(false);
      setMaintenance(false);
    }
  }, [decision]);

  const goToStore = () => {
    if (storeUrl) Linking.openURL(storeUrl);
  };

  const forceUpdate = () => {
    if (storeUrl) Linking.openURL(storeUrl);
    setTimeout(() => {
      BackHandler.exitApp();
    }, 1500);
  };

  return (
    <>
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
              <NotificationInitializer />
            </NavigationContainer>
          </ContextProvider>
        </ErrorBoundary>
      </NativeBaseProvider>
      <SoftUpdateModal open={soft} onUpdate={goToStore} onSkip={() => setSoft(false)} />
      <ForceUpdateModal open={force} onUpdate={forceUpdate} />
      <MaintenanceModal open={maintenance} />
    </>
  );
}
