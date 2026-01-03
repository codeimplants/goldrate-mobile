import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLiveRates, LiveRates } from '../../shared/services/liveRates';
import LinearGradient from 'react-native-linear-gradient';

interface MetalRate {
  id: string;
  name: string;
  price: number;
  isPopular?: boolean;
}

const Homepage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [metalRates, setMetalRates] = useState<MetalRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Convert LiveRates to MetalRate array
  const convertLiveRatesToMetalRates = (rates: LiveRates): MetalRate[] => {
    return [
      { id: '1', name: 'Gold 14 Ct', price: rates.goldPrice14K || 0 },
      { id: '2', name: 'Gold 18 Ct', price: rates.goldPrice18K || 0 },
      { id: '3', name: 'Gold 22 Ct', price: rates.goldPrice22K || 0, isPopular: true },
      { id: '4', name: 'Gold 24 Ct (995GW)', price: rates.goldPrice24K995GW || 0 ,isPopular: true},
      { id: '5', name: 'Gold 24 Ct (995)', price: rates.goldPrice24K995 || 0 },
      { id: '6', name: 'Gold 24 Ct (999)', price: rates.goldPrice24K || 0 },
      { id: '7', name: 'Silver', price: rates.silverPrice || 0 },
      { id: '8', name: 'Silver Bar', price: rates.silverBarPrice || 0 },
      { id: '9', name: 'Platinum', price: rates.platinumPrice || 0 },
    ];
  };

  // Save data to local storage
  const saveDataLocally = async (rates: MetalRate[], timestamp: string) => {
    try {
      await AsyncStorage.setItem('metalRates', JSON.stringify(rates));
      await AsyncStorage.setItem('lastUpdated', timestamp);
    } catch (error) {
      console.error('Error saving data locally:', error);
    }
  };

  // Load data from local storage
  const loadLocalData = async () => {
    try {
      const storedRates = await AsyncStorage.getItem('metalRates');
      const storedTimestamp = await AsyncStorage.getItem('lastUpdated');
      
      if (storedRates && storedTimestamp) {
        setMetalRates(JSON.parse(storedRates));
        setLastUpdated(storedTimestamp);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading local data:', error);
      return false;
    }
  };

 const fetchMetalRates = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        // Load cached data first on initial load
        await loadLocalData();
        setRefreshing(true);
      }
      setError('');
      
      const response = await getLiveRates();
      console.log('Received API response:', response);
      
      const convertedRates = convertLiveRatesToMetalRates(response.rates);
      setMetalRates(convertedRates);
      
      // Format the API timestamp for display
      let formattedTime = '';
      if (response.timestamp) {
        const apiTimestamp = new Date(response.timestamp);
        formattedTime = apiTimestamp.toLocaleDateString('en-GB') + ' • ' + 
                       apiTimestamp.toLocaleTimeString('en-US', { 
                         hour: '2-digit', 
                         minute: '2-digit',
                         hour12: true 
                       });
      } else {
        // Fallback to current time if API doesn't provide timestamp
        const now = new Date();
        formattedTime = now.toLocaleDateString('en-GB') + ' • ' + 
                       now.toLocaleTimeString('en-US', { 
                         hour: '2-digit', 
                         minute: '2-digit',
                         hour12: true 
                       });
      }
      
      setLastUpdated(formattedTime);
      
      // Save to local storage
      await saveDataLocally(convertedRates, formattedTime);
      
    } catch (error) {
      console.error('Error fetching metal rates:', error);
      
      // Try to load cached data
      const hasLocalData = await loadLocalData();
      
      if (hasLocalData) {
        setError('Using offline data. Tap refresh to try again.');
      } else {
        setError('Unable to load data. Please check your connection.');
        // Set default empty rates
        const emptyRates: MetalRate[] = [
          { id: '1', name: 'Gold 14 Ct', price: 0 },
          { id: '2', name: 'Gold 18 Ct', price: 0 },
          { id: '3', name: 'Gold 22 Ct', price: 0, isPopular: true },
          { id: '4', name: 'Gold 24 Ct (995GW)', price: 0 },
          { id: '5', name: 'Gold 24 Ct (995)', price: 0 },
          { id: '6', name: 'Gold 24 Ct (999)', price: 0 },
          { id: '7', name: 'Silver', price: 0 },
          { id: '8', name: 'Silver Bar', price: 0 },
          { id: '9', name: 'Platinum', price: 0 },
        ];
        setMetalRates(emptyRates);
        setLastUpdated('No data available');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetalRates();
  }, []);

  const handleLoginPress = () => {
    navigation.navigate('login');
  };

  // Helper function to safely format price
  const formatPrice = (price: number): string => {
    if (price === 0) return '-';
    return price.toLocaleString('en-IN');
  };

  const handleRefresh = () => {
    fetchMetalRates(true);
  };



return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f4ff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Metal Rates</Text>
          <LinearGradient

                            colors={['#a855f7', '#ec4899']}
                            style={styles.buttonWrapper}
                            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
                          >     
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Error Message */}
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Last Updated */}
      <View style={styles.lastUpdatedContainer}>
        <Text style={styles.lastUpdated}>
          Last updated: {refreshing ? (
            <ActivityIndicator size="small" color="#8b5cf6" />
          ) : (
            lastUpdated || 'Loading...'
          )}
        </Text>
      </View>

      {/* Metal Rates List */}
      <ScrollView style={styles.ratesList} showsVerticalScrollIndicator={false}>
        {metalRates.map((rate) => (
          <View key={rate.id} style={styles.rateCard}>
            <View style={styles.rateInfo}>
              <Text style={styles.metalName}>{rate.name}</Text>
              {/* {rate.isPopular && (
                <Text style={styles.popularTag}>Most Popular</Text>
              )} */}
            </View>
            <View style={styles.priceContainer}>
              {refreshing ? (
                <ActivityIndicator size="small" color="#e91e63" />
              ) : (
                <Text style={styles.price}>₹ {formatPrice(rate.price)}</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pull to refresh hint */}
      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={handleRefresh}
        disabled={refreshing}
      >
        <Text style={[styles.refreshText, refreshing && styles.refreshTextDisabled]}>
          {refreshing ? 'Refreshing...' : 'Tap to refresh rates'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4ff',
    paddingHorizontal: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  loginButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 25,
  },
  buttonWrapper: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  loginButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,

  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  lastUpdatedContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lastUpdated: {
    textAlign: 'center',
    color: '#8b5cf6',
    fontSize: 16,
  },
  ratesList: {
    flex: 1,
  },
  rateCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rateInfo: {
    flex: 1,
  },
  metalName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  popularTag: {
    fontSize: 12,
    color: '#8b5cf6',
    fontWeight: '500',
  },
  priceContainer: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#611495',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  refreshButton: {
    paddingVertical: 14,
    alignItems: 'center',
    borderTopWidth: 1,
  borderTopColor: '#ccc',
  },
  refreshText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '500',
    paddingVertical: 12,
  },
  refreshTextDisabled: {
    color: '#cbd5e1',
  },
});

export default Homepage;