import { mockUsers, mockParts, mockTransactions, mockRequests, mockDashboardStats, mockLowStockItems, mockRecentTransactions } from './mock-data';

// In the future, you can replace these functions with Supabase client calls.

export const getDashboardStats = async (role: string) => {
  return Promise.resolve(mockDashboardStats[role] || mockDashboardStats.admin);
};

export const getLowStockItems = async () => {
  return Promise.resolve(mockLowStockItems);
};

export const getRecentTransactions = async () => {
  return Promise.resolve(mockRecentTransactions);
};

export const getUsers = async () => {
  return Promise.resolve(mockUsers);
};

export const getParts = async () => {
  return Promise.resolve(mockParts);
};

export const getTransactions = async () => {
  return Promise.resolve(mockTransactions);
};

export const getRequests = async () => {
  return Promise.resolve(mockRequests);
};
