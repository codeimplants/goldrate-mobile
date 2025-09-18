import apiClient from './apiClient';
export interface BroadcastRateBody {
  rate: number;
  purity: '24K' | '22K' | '18K';
  wholesalerId: number | string;
}

export const broadcastRate = async (body: BroadcastRateBody) => {
  const res = await apiClient.post('/api/wholesaler/broadcastRate', body); // Updated path
  return res.data;
};

export interface CurrentRateItem {
  id?: string;
  rate: number;
  purity: string;
  createdAt: string;
  wholealer?: { 
    name: string;
    id: number;
    userId: number;
  };
  wholesalerId: number;
  date: string;
  
}

export const fetchCurrentRates = async (wholesalerId: number): Promise<CurrentRateItem[]> => {
  const res = await apiClient.get(`/api/wholesaler/myRates?wholesalerId=${wholesalerId}`);
  return res.data as CurrentRateItem[];
};


export interface Retailer {
  id: number;
  name: string;
  mobile: string;
  userCode: string;
  wholesalerName: string;
  linkedAt: string;
}

export const fetchRetailers = async (wholesalerId: number): Promise<Retailer[]> => {
  const res = await apiClient.get(`/api/wholesaler/myRetailers?wholesalerId=${wholesalerId}`);
  return res.data as Retailer[];
};
// Remove broadcastGoldRate as it's redundant now

export const fetchCurrentRatesForRetailer = async (): Promise<CurrentRateItem[]> => {
  const res = await apiClient.get(`api/retailer/getGoldRates`);
  return res.data as CurrentRateItem[];
}