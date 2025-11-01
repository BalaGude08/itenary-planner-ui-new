import { featureFlags } from '@/lib/featureFlags';
import { OnboardingData } from '@/store/itinerary.store';
import { getMockResponse, ItineraryResponse } from './mockService';

const API_BASE_URL = 'https://listening-romantic-tools-decimal.trycloudflare.com/dev-ui';

interface ApiRequestConfig extends RequestInit {
  params?: Record<string, string>;
}

export class ApiService {
  private sessionId: string | null = null;
  public currentResponse: ItineraryResponse | null = null;

  constructor() {
    // Try to restore session from localStorage
    this.sessionId = localStorage.getItem('chatSessionId');
  }

  private async request<T>(endpoint: string, config: ApiRequestConfig = {}): Promise<T> {
    if (featureFlags.useMocks) {
      // If using mocks
      if (endpoint === '/' || endpoint === '/chat') {
        const body = JSON.parse(config.body as string);
        if (endpoint === '/chat') {
          return getMockResponse(body.message) as T;
        }
        return getMockResponse(body.tripDetails) as T;
      }
      throw new Error('Mock not implemented for this endpoint');
    }

    const { params, ...requestConfig } = config;
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    // Add session ID if available
    if (this.sessionId) {
      url.searchParams.append('sessionId', this.sessionId);
    }

    try {
      const response = await fetch(url.toString(), {
        ...requestConfig,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Update session ID if provided in response
      if (data.sessionId) {
        this.sessionId = data.sessionId;
        localStorage.setItem('chatSessionId', data.sessionId);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  clearSession() {
    this.sessionId = null;
    localStorage.removeItem('chatSessionId');
  }

  async generateItinerary(tripDetails: OnboardingData): Promise<ItineraryResponse> {
    const response = await this.request<ItineraryResponse>('/', {
      method: 'POST',
      body: JSON.stringify({
        tripDetails,
        app: 'itenary-agents'
      }),
    });
    this.currentResponse = response;
    return response;
  }

  async sendFollowUp(message: string): Promise<ItineraryResponse> {
    const response = await this.request<ItineraryResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        sessionId: this.sessionId,
        app: 'itenary-agents'
      }),
    });
    this.currentResponse = response;
    return response;
  }
}

export const api = new ApiService();