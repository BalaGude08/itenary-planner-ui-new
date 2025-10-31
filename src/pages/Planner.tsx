import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useItineraryStore, Itinerary } from '@/store/itinerary.store';
import { AppBar } from '@/components/AppBar';
import { ConversationalChat } from '@/components/ConversationalChat';
import { TripProgress } from '@/components/TripProgress';
import { WeatherStrip } from '@/components/WeatherStrip';
import { CostBreakdown } from '@/components/CostBreakdown';
import { Button } from '@/components/ui/button';

export default function Planner() {
  const { itineraryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { setItinerary, currentItinerary } = useItineraryStore();
  const [currentDay, setCurrentDay] = useState(1);
  const [showItinerary, setShowItinerary] = useState(false);
  
  const initialMessage = location.state?.initialMessage;

  const handleConversationComplete = () => {
    setShowItinerary(true);
    
    // Mock itinerary data
    const mockItinerary: Itinerary = {
      id: itineraryId || 'demo',
      title: 'Amazing Mumbai Adventure',
      currency: '₹',
      totalCost: 45000,
      days: [
        {
          date: '2025-11-01',
          weather: { temp: 28, condition: 'Sunny' },
          activities: [
            {
              id: '1',
              time: '09:00',
              title: 'Gateway of India',
              description: 'Start your day at this iconic monument',
              cost: 0,
            },
            {
              id: '2',
              time: '12:00',
              title: 'Lunch at Leopold Cafe',
              description: 'Famous historic cafe',
              cost: 800,
            },
            {
              id: '3',
              time: '15:00',
              title: 'Marine Drive Walk',
              description: 'Scenic coastal promenade',
              cost: 0,
            },
          ],
        },
        {
          date: '2025-11-02',
          weather: { temp: 29, condition: 'Partly Cloudy' },
          activities: [
            {
              id: '4',
              time: '10:00',
              title: 'Elephanta Caves',
              description: 'UNESCO World Heritage Site',
              cost: 500,
            },
          ],
        },
        {
          date: '2025-11-03',
          weather: { temp: 27, condition: 'Cloudy' },
          activities: [
            {
              id: '5',
              time: '11:00',
              title: 'Colaba Causeway Shopping',
              description: 'Browse local markets',
              cost: 2000,
            },
          ],
        },
      ],
    };
    
    setItinerary(mockItinerary);
  };

  const weatherDays = currentItinerary?.days.map((d) => ({
    date: d.date,
    temp: d.weather?.temp || 25,
    condition: d.weather?.condition || 'Sunny',
  })) || [];

  const costs = [
    { category: 'Accommodation', amount: 15000 },
    { category: 'Activities', amount: 12000 },
    { category: 'Food', amount: 10000 },
    { category: 'Transport', amount: 8000 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      
      <div className="pt-16 h-screen flex">
        {/* Left: Conversational Chat */}
        <div className="w-[500px] border-r h-full overflow-hidden">
          <ConversationalChat 
            initialMessage={initialMessage}
            onComplete={handleConversationComplete}
          />
        </div>

        {/* Right: Dynamic Trip Summary Panel */}
        <div className="flex-1 overflow-y-auto bg-muted/30">
          {!showItinerary ? (
            <div className="container mx-auto p-6 max-w-4xl h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-5xl">
                  ✈️
                </div>
                <h2 className="text-2xl font-bold mb-3">Planning Your Perfect Trip</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Answer a few questions in the chat, and I'll create a personalized itinerary just for you.
                </p>
              </div>
            </div>
          ) : currentItinerary ? (
            <div className="container mx-auto p-6 max-w-4xl">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{currentItinerary.title}</h1>
                <p className="text-muted-foreground">
                  {currentItinerary.days.length} days • {currentItinerary.currency}{currentItinerary.totalCost}
                </p>
              </div>

              {/* Trip Progress */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Trip Overview</h3>
                <TripProgress
                  currentStep={currentDay}
                  totalSteps={currentItinerary.days.length}
                />
              </div>

              {/* Weather Strip */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Weather Forecast</h3>
                <WeatherStrip days={weatherDays} />
              </div>

              {/* Cost Breakdown */}
              <div className="mb-6">
                <CostBreakdown costs={costs} currency={currentItinerary.currency} />
              </div>

              {/* Day Selector */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Daily Itinerary</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {currentItinerary.days.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentDay(idx + 1)}
                      className={`px-4 py-2 rounded-lg border-2 flex-shrink-0 transition-all ${
                        currentDay === idx + 1
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      Day {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Day Activities */}
              <div className="space-y-4 mb-6">
                {currentItinerary.days[currentDay - 1]?.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-card rounded-lg border p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {activity.time}
                        </div>
                        <h4 className="font-semibold text-lg">{activity.title}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {activity.cost > 0
                            ? `${currentItinerary.currency}${activity.cost}`
                            : 'Free'}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{activity.description}</p>
                  </div>
                ))}
              </div>

              {/* View Details & Book Now */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/itinerary/${currentItinerary.id}`)}
                  className="flex-1"
                >
                  View Full Itinerary
                </Button>
                <Button
                  onClick={() => navigate('/checkout')}
                  className="flex-1 bg-accent hover:bg-accent/90"
                >
                  Book Now
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
