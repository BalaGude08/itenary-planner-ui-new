import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItineraryStore } from '@/store/itinerary.store';
import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Share() {
  const navigate = useNavigate();
  const { currentItinerary, onboardingData } = useItineraryStore();
  
  const shareUrl = `${window.location.origin}/itinerary/${currentItinerary?.id}`;
  const [reminderSet, setReminderSet] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  const handleDownloadPDF = () => {
    // Placeholder - PDF generation not implemented
    alert('PDF download will be available soon!');
  };
  
  const handleReminder = () => {
    setReminderSet(true);
    alert('I\'ll remind you 24 hours before your departure!');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">
              Your AI-planned trip is all set!
            </h1>
            <p className="text-muted-foreground">
              I've booked everything you asked for. Get ready for an amazing adventure!
            </p>
          </div>

          <div className="bg-card rounded-lg border p-8 mb-6">
            <h2 className="text-xl font-semibold mb-4">Share Your Itinerary</h2>
            
            <div className="flex gap-2 mb-4">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button onClick={handleCopy}>Copy Link</Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
              >
                Download PDF
              </Button>
              <Button
                onClick={() => navigate(`/itinerary/${currentItinerary?.id}`)}
                variant="outline"
              >
                Edit Plan
              </Button>
            </div>
            
            <Button
              onClick={handleReminder}
              variant={reminderSet ? "default" : "outline"}
              className="w-full"
              disabled={reminderSet}
            >
              {reminderSet ? '✅ Reminder Set!' : '🔔 Remind me 24h before departure'}
            </Button>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-accent hover:bg-accent/90"
            >
              Plan Another Trip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
