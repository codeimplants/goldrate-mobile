import { Box, Button, Center, Text } from 'native-base';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../../feature/auth/hooks/useAuth';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  return (
    <SafeAreaProvider>
      <Box safeArea flex={1}>
        <Center>
          <Text fontSize={'xl'}>Dashboard</Text>
          <Button
            onPress={() => {
              logout();
            }}
          >
            logout
          </Button>
        </Center>
      </Box>
    </SafeAreaProvider>
  );
};

export default Dashboard;
