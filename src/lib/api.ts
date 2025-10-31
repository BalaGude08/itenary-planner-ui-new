// API utilities - placeholder stubs for future implementation

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';

export const api = {
  createItinerary: async (data: any) => {
    // Placeholder - will connect to real API
    return {
      id: `itin-${Date.now()}`,
      ...data,
    };
  },
  
  updateItinerary: async (id: string, data: any) => {
    // Placeholder
    return { id, ...data };
  },
  
  getItinerary: async (id: string) => {
    // Placeholder
    return null;
  },
};
