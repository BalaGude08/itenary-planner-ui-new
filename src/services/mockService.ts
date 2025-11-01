import { OnboardingData } from '@/store/itinerary.store';

// Mock response structure that matches what we expect from the external API
export interface Suggestion {
  type: 'modification' | 'question' | 'recommendation';
  text: string;
  context?: {
    activityId?: string;
    dayIndex?: number;
    category?: string;
  };
}

export interface ItineraryResponse {
  sessionId: string;
  message: string;
  isFollowUpQuestion?: boolean;
  itinerary?: {
    id: string;
    title: string;
    summary: string;
    days: Array<{
      date: string;
      activities: Array<{
        id: string;
        time: string;
        title: string;
        description: string;
        location: string;
        cost: number;
        category: string;
        duration: string;
        bookingUrl?: string;
      }>;
      weather?: {
        temp: number;
        condition: string;
        icon: string;
      };
    }>;
    totalCost: number;
    currency: string;
    metadata: {
      destinationCity: string;
      duration: number;
      travelers: {
        adults: number;
        children: number;
        infants: number;
      };
      budget: string;
      themes: string[];
    };
  };
  suggestions?: Suggestion[];
}

const mockFollowUps: Record<string, ItineraryResponse> = {
  'Would you like to see more restaurant options?': {
    sessionId: 'mock-session-123',
    message: 'I can suggest several great dining options. What type of cuisine are you interested in?',
    isFollowUpQuestion: true,
    suggestions: [
      { type: 'question', text: 'Local authentic cuisine' },
      { type: 'question', text: 'International restaurants' },
      { type: 'question', text: 'Fine dining experiences' },
      { type: 'question', text: 'Family-friendly restaurants' }
    ]
  },
  'I can suggest alternative activities if you prefer': {
    sessionId: 'mock-session-123',
    message: 'I can help you modify the activities. What would you like to focus on?',
    isFollowUpQuestion: true,
    suggestions: [
      { 
        type: 'modification',
        text: 'More relaxed pace',
        context: { category: 'pace' }
      },
      {
        type: 'modification',
        text: 'More outdoor activities',
        context: { category: 'outdoor' }
      },
      {
        type: 'modification',
        text: 'More cultural experiences',
        context: { category: 'culture' }
      }
    ]
  },
  'Would you like more details about any specific activity?': {
    sessionId: 'mock-session-123',
    message: 'Which day or activity would you like to know more about?',
    isFollowUpQuestion: true,
    suggestions: [
      {
        type: 'question',
        text: 'Tell me more about the morning activities',
        context: { category: 'morning' }
      },
      {
        type: 'question',
        text: 'What are the afternoon options?',
        context: { category: 'afternoon' }
      },
      {
        type: 'question',
        text: 'Details about evening activities',
        context: { category: 'evening' }
      }
    ]
  }
};

export const getMockResponse = (tripDetails: OnboardingData | string): ItineraryResponse => {
  // Handle follow-up questions
  if (typeof tripDetails === 'string') {
    return mockFollowUps[tripDetails] || {
      sessionId: 'mock-session-123',
      message: 'I can help you with that. Could you please be more specific?',
      isFollowUpQuestion: true,
      suggestions: [
        { type: 'question', text: 'Would you like to modify the schedule?' },
        { type: 'question', text: 'Should we look at different activities?' },
        { type: 'question', text: 'Do you want to change the budget range?' }
      ]
    };
  }

  // Initial itinerary generation
  const startDate = tripDetails.dates?.start ? new Date(tripDetails.dates.start) : new Date();
  
  return {
    sessionId: 'mock-session-123',
    message: '✨ I\'ve created a personalized itinerary based on your preferences!',
    itinerary: {
      id: 'mock-itinerary-123',
      title: `${tripDetails.duration}-Day Trip to ${tripDetails.destinationCity}`,
      summary: `A ${tripDetails.budget} itinerary focused on ${tripDetails.themes?.join(', ')}`,
      days: Array.from({ length: tripDetails.duration || 3 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        return {
          date: date.toISOString(),
          activities: [
            {
              id: `activity-${i}-1`,
              time: '09:00',
              title: 'Morning Activity',
              description: 'Start your day with an exciting local experience',
              location: tripDetails.destinationCity,
              cost: 50,
              category: 'Culture',
              duration: '2 hours'
            },
            {
              id: `activity-${i}-2`,
              time: '12:00',
              title: 'Lunch Break',
              description: 'Enjoy local cuisine at a popular restaurant',
              location: 'City Center',
              cost: 30,
              category: 'Food',
              duration: '1.5 hours'
            },
            {
              id: `activity-${i}-3`,
              time: '14:00',
              title: 'Afternoon Adventure',
              description: 'Explore local attractions and sights',
              location: 'Various Locations',
              cost: 40,
              category: 'Sightseeing',
              duration: '3 hours'
            }
          ],
          weather: {
            temp: 25,
            condition: 'Sunny',
            icon: '☀️'
          }
        };
      }),
      totalCost: (tripDetails.duration || 3) * 120,
      currency: 'USD',
      metadata: {
        destinationCity: tripDetails.destinationCity || '',
        duration: tripDetails.duration || 3,
        travelers: tripDetails.travelers || { adults: 1, children: 0, infants: 0 },
        budget: tripDetails.budget || 'moderate',
        themes: tripDetails.themes || []
      }
    },
    suggestions: [
      { 
        type: 'question',
        text: 'Would you like to see more restaurant options?'
      },
      {
        type: 'question',
        text: 'I can suggest alternative activities if you prefer'
      },
      {
        type: 'question',
        text: 'Would you like more details about any specific activity?'
      }
    ]
  };
};