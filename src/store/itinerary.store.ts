import { create } from 'zustand';

export type Locale = 'en' | 'hi' | 'te';

export interface OnboardingData {
  departureCity?: string;
  destinationCity?: string;
  dates?: { start: string; end: string };
  duration?: number;
  travelers?: {
    adults: number;
    children: number;
    infants: number;
    childrenAges?: number[];
  };
  budget?: 'budget' | 'moderate' | 'luxury';
  themes?: string[];
  constraints?: string[];
  flights?: {
    include: boolean;
    preference?: string;
  };
  accommodation?: {
    include: boolean;
    starRating?: string;
  };
}

export interface Itinerary {
  id: string;
  title: string;
  days: ItineraryDay[];
  totalCost: number;
  currency: string;
}

export interface ItineraryDay {
  date: string;
  activities: Activity[];
  weather?: {
    temp: number;
    condition: string;
  };
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  cost: number;
}

interface ItineraryState {
  locale: Locale;
  onboardingData: OnboardingData;
  currentItinerary: Itinerary | null;
  chatMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
  
  setLocale: (locale: Locale) => void;
  updateOnboarding: (data: Partial<OnboardingData>) => void;
  setItinerary: (itinerary: Itinerary) => void;
  addChatMessage: (role: 'user' | 'assistant', content: string) => void;
  clearChat: () => void;
}

export const useItineraryStore = create<ItineraryState>((set) => ({
  locale: 'en',
  onboardingData: {},
  currentItinerary: null,
  chatMessages: [],
  
  setLocale: (locale) => set({ locale }),
  
  updateOnboarding: (data) => 
    set((state) => ({ 
      onboardingData: { ...state.onboardingData, ...data } 
    })),
  
  setItinerary: (itinerary) => set({ currentItinerary: itinerary }),
  
  addChatMessage: (role, content) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, { role, content }]
    })),
  
  clearChat: () => set({ chatMessages: [] }),
}));
