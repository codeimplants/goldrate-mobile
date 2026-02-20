import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLiveRates, LiveRates } from '../../shared/services/liveRates';
import LinearGradient from 'react-native-linear-gradient';
import { HStack } from 'native-base';

interface MetalRate {
  id: string;
  name: string;
  price: number;
  isPopular?: boolean;
  value?: string;
  GST?: string;
  description?: string;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Homepage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [metalRates, setMetalRates] = useState<MetalRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  // Convert LiveRates to MetalRate array
  const convertLiveRatesToMetalRates = (rates: LiveRates): MetalRate[] => {
    return [
      { id: '1', name: 'Gold 14 Ct', price: rates.goldPrice14K || 0, },
      { id: '2', name: 'Gold 18 Ct', price: rates.goldPrice18K || 0, },
      { id: '3', name: 'Gold 22 Ct', price: rates.goldPrice22K || 0, isPopular: true, },
      { id: '4', name: 'Gold 24 Ct (995GW)', price: rates.goldPrice24K995GW || 0, isPopular: true, },
      { id: '5', name: 'Gold 24 Ct (995)', price: rates.goldPrice24K995 || 0, },
      { id: '6', name: 'Gold 24 Ct (999)', price: rates.goldPrice24K || 0, },
      { id: '7', name: 'Silver', price: rates.silverPrice || 0, },
      { id: '8', name: 'Silver Bar', price: rates.silverBarPrice || 0, },
      { id: '9', name: 'Platinum', price: rates.platinumPrice || 0, },
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
          { id: '1', name: 'Gold 14 Ct', price: 0, },
          { id: '2', name: 'Gold 18 Ct', price: 0, },
          { id: '3', name: 'Gold 22 Ct', price: 0, isPopular: true, },
          { id: '4', name: 'Gold 24 Ct (995GW)', price: 0, },
          { id: '5', name: 'Gold 24 Ct (995)', price: 0, },
          { id: '6', name: 'Gold 24 Ct (999)', price: 0, },
          { id: '7', name: 'Silver', price: 0, },
          { id: '8', name: 'Silver Bar', price: 0, },
          { id: '9', name: 'Platinum', price: 0, },
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

  const GST_RATE = 0.03;
  const calculatedValueWithGST = (price: number): number => {
    return Math.round(price + (price * GST_RATE));
  };

  const calculatedGST = (price: number): number => {
    return Math.round(price * GST_RATE);
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
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
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
      <HStack style={styles.lastUpdatedContainer}>
        <Text style={styles.lastUpdated}>
          Last updated: {refreshing ? (
            <ActivityIndicator size="small" color="#8b5cf6" />
          ) : (
            lastUpdated || 'Loading...'
          )}
        </Text>
        {/* Pull to refresh hint */}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={refreshing}
        >
          <Text style={[styles.refreshText, refreshing && styles.refreshTextDisabled]}>
            {refreshing ? '' : '⟳'}
          </Text>
        </TouchableOpacity>
      </HStack>

      {/* Metal Rates List */}
      <ScrollView style={styles.ratesList} showsVerticalScrollIndicator={false}>
        {metalRates.map((rate) => (
          <View key={rate.id} style={styles.accordionContainer}>
            <TouchableOpacity
              style={styles.rateCard}
              onPress={() => toggleAccordion(rate.id)}
              activeOpacity={0.7}
            >
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
                  <HStack style={{ alignItems: 'center' }}>
                    <Text style={styles.price}>₹ {calculatedValueWithGST(rate.price)}</Text>
                  </HStack>
                )}
              </View>
            </TouchableOpacity>

            {expandedId === rate.id && (
              <View style={styles.detailSection}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Value:</Text>
                  <Text style={styles.detailValue}>₹ {formatPrice(rate.price)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>GST (3%)</Text>
                  <Text style={styles.detailValue}>₹ {calculatedGST(rate.price)}</Text>
                </View>

                <HStack style={styles.calculatedValue}>
                  <Text style={styles.calculatedValueLabel}>TOTAL COST</Text>
                  <Text style={[styles.calculatedValueLabel, { marginLeft: "auto" }]}>₹ {calculatedValueWithGST(rate.price)}</Text>
                </HStack>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
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
    alignItems: 'center'
  },
  lastUpdated: {
    textAlign: 'center',
    color: '#6b32c6',
    fontSize: 16,
  },
  ratesList: {
    flex: 1,
  },
  accordionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  rateCard: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: '#6b32c6',
    fontWeight: '500',
  },
  priceContainer: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b32c6',
  },
  detailSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fafafa',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  refreshButton: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 8,
    marginLeft: "auto",
    marginTop: -5
  },
  refreshText: {
    color: '#6b32c6',
    fontSize: 30,
    fontWeight: "bold",
    paddingVertical: 12,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  refreshTextDisabled: {
    color: '#cbd5e1',
  },
  calculatedValue: {
    borderWidth: 1,
    borderColor: "#e9d5ff",
    padding: 10,
    borderRadius: 12,
    marginTop: 15,
    backgroundColor: "#f8f4ff",
  },
  calculatedValueLabel: {
    fontWeight: "bold",
    color: "#6b32c6",
    fontSize: 18,
  }
});

export default Homepage;