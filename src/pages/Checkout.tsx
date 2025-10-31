import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItineraryStore } from '@/store/itinerary.store';
import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Checkout() {
  const navigate = useNavigate();
  const { currentItinerary } = useItineraryStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    travelers: '1',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock payment processing
    navigate('/share');
  };

  if (!currentItinerary) {
    return (
      <div className="min-h-screen bg-background">
        <AppBar />
        <div className="pt-24 px-6 text-center">
          <p>No itinerary selected</p>
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
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <div className="bg-card rounded-lg border p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trip</span>
                    <span className="font-medium">{currentItinerary.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{currentItinerary.days.length} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Travelers</span>
                    <span className="font-medium">{formData.travelers}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {currentItinerary.currency}
                      {currentItinerary.totalCost * parseInt(formData.travelers || '1')}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Price includes all activities, meals, and accommodations as per the itinerary
                </p>
              </div>
            </div>

            {/* Traveler Form */}
            <div>
              <form onSubmit={handleSubmit} className="bg-card rounded-lg border p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-4">Traveler Information</h2>

                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="travelers">Number of Travelers</Label>
                  <Input
                    id="travelers"
                    type="number"
                    min="1"
                    value={formData.travelers}
                    onChange={(e) =>
                      setFormData({ ...formData, travelers: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                    Proceed to Payment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
