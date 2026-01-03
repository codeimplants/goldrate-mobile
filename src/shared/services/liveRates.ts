import apiClient from './apiClient';

export interface LiveRates {
    goldPrice24K: number;
    goldPrice24K995: number;
    goldPrice24K995GW: number;
    goldPrice22K: number;
    goldPrice18K: number;
    goldPrice14K: number;
    silverPrice: number;
    silverBarPrice: number;
    platinumPrice: number;
}

interface ApiResponse {
  success: boolean;
  timestamp: string;
  rates: LiveRates;
}

export const getLiveRates = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.get<ApiResponse>('/api/liveRates');
    console.log('API Response:', response.data);
    
    if (response.status === 200 && response.data.success) {
      return response.data; // Return the complete response with timestamp
    } else {
      throw new Error('Failed to fetch live rates - Invalid response');
    }
  } catch (error) {
    console.error('Error fetching live rates:', error);
    throw error;
  }
};