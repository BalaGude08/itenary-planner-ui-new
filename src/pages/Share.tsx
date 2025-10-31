import { useNavigate } from 'react-router-dom';
import { useItineraryStore } from '@/store/itinerary.store';
import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Share() {
  const navigate = useNavigate();
  const { currentItinerary } = useItineraryStore();
  
  const shareUrl = `${window.location.origin}/itinerary/${currentItinerary?.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  const handleDownloadPDF = () => {
    // Placeholder - PDF generation not implemented
    alert('PDF download will be available soon!');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your trip has been successfully booked
            </p>
          </div>

          <div className="bg-card rounded-lg border p-8 mb-6">
            <h2 className="text-xl font-semibold mb-4">Share Your Itinerary</h2>
            
            <div className="flex gap-2 mb-6">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button onClick={handleCopy}>Copy</Button>
            </div>

            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              className="w-full"
            >
              Download PDF
            </Button>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate(`/itinerary/${currentItinerary?.id}`)}
              className="w-full"
            >
              View Itinerary
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              Plan Another Trip
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
