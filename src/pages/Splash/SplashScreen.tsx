import React from 'react';
import { View, Image, StyleSheet, SafeAreaView } from 'react-native';

export const SplashScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('./splash.png')}
          style={styles.image}
          resizeMode="cover"
        />
        {/* <Text style={styles.text}>सोने भाव</Text> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#06232b',
  },
  container: {
    flex: 1,
    backgroundColor: '#06232b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  text: {
    fontSize: 48,
    color: '#F7E38A',
    fontWeight: 'bold',
    fontFamily: 'sans-serif',
  },
});

export default SplashScreen;