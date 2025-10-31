import { useParams, useNavigate } from 'react-router-dom';
import { useItineraryStore } from '@/store/itinerary.store';
import { AppBar } from '@/components/AppBar';
import { MapPanel } from '@/components/MapPanel';
import { Button } from '@/components/ui/button';

export default function ItineraryDetail() {
  const { itineraryId } = useParams();
  const navigate = useNavigate();
  const { currentItinerary } = useItineraryStore();

  if (!currentItinerary) {
    return (
      <div className="min-h-screen bg-background">
        <AppBar />
        <div className="pt-24 px-6 text-center">
          <p>Itinerary not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              ← Back
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">{currentItinerary.title}</h1>
            <p className="text-muted-foreground">
              Complete {currentItinerary.days.length}-day itinerary
            </p>
          </div>

          {/* Map */}
          <div className="mb-8">
            <MapPanel />
          </div>

          {/* Day Cards */}
          <div className="space-y-8">
            {currentItinerary.days.map((day, dayIdx) => (
              <div key={dayIdx} className="bg-card rounded-lg border p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Day {dayIdx + 1}</h2>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    {day.weather && (
                      <div className="text-sm">
                        {day.weather.temp}° • {day.weather.condition}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {day.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="text-sm font-medium text-muted-foreground min-w-[60px]">
                        {activity.time}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-right">
                        {activity.cost > 0
                          ? `${currentItinerary.currency}${activity.cost}`
                          : 'Free'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/planner/${itineraryId}`)}
              className="flex-1"
            >
              Edit in Planner
            </Button>
            <Button
              onClick={() => navigate('/checkout')}
              className="flex-1 bg-accent hover:bg-accent/90"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
