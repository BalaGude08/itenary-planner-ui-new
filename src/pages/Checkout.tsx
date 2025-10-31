import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItineraryStore } from '@/store/itinerary.store';
import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Checkout() {
  const navigate = useNavigate();
  const { currentItinerary, onboardingData } = useItineraryStore();
  
  // Pre-fill from conversation data
  const initialTravelers = onboardingData.travelers || { adults: 1, children: 0, infants: 0 };
  const totalTravelers = initialTravelers.adults + initialTravelers.children + initialTravelers.infants;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const [travelers, setTravelers] = useState<Array<{ name: string; age: string; gender: string; type: string }>>(() => {
    const list = [];
    // Pre-fill adults
    for (let i = 0; i < initialTravelers.adults; i++) {
      list.push({ name: '', age: '', gender: '', type: 'Adult' });
    }
    // Pre-fill children with ages if available
    for (let i = 0; i < initialTravelers.children; i++) {
      const age = initialTravelers.childrenAges?.[i] || '';
      list.push({ name: '', age: age.toString(), gender: '', type: 'Child' });
    }
    // Pre-fill infants
    for (let i = 0; i < initialTravelers.infants; i++) {
      list.push({ name: '', age: '', gender: '', type: 'Infant' });
    }
    return list;
  });
  
  const [showBreakdown, setShowBreakdown] = useState(false);

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
                    <span className="font-medium">{totalTravelers}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {currentItinerary.currency}
                      {currentItinerary.totalCost * totalTravelers}
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mb-4"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                >
                  {showBreakdown ? 'Hide' : 'View'} Cost Breakdown
                </Button>
                
                {showBreakdown && (
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Accommodation</span>
                      <span>{currentItinerary.currency}{Math.round(currentItinerary.totalCost * 0.4 * totalTravelers)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Activities</span>
                      <span>{currentItinerary.currency}{Math.round(currentItinerary.totalCost * 0.3 * totalTravelers)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Food</span>
                      <span>{currentItinerary.currency}{Math.round(currentItinerary.totalCost * 0.2 * totalTravelers)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transport</span>
                      <span>{currentItinerary.currency}{Math.round(currentItinerary.totalCost * 0.1 * totalTravelers)}</span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Price includes all activities, meals, and accommodations as per the itinerary
                </p>
              </div>
            </div>

            {/* Traveler Form */}
            <div>
              <form onSubmit={handleSubmit} className="bg-card rounded-lg border p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <div className="space-y-4">
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
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Traveler Details</h2>
                  <div className="space-y-4">
                    {travelers.map((traveler, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-3">
                          Traveler {idx + 1} ({traveler.type})
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <Label htmlFor={`traveler-name-${idx}`}>Full Name</Label>
                            <Input
                              id={`traveler-name-${idx}`}
                              value={traveler.name}
                              onChange={(e) => {
                                const newTravelers = [...travelers];
                                newTravelers[idx].name = e.target.value;
                                setTravelers(newTravelers);
                              }}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`traveler-age-${idx}`}>Age</Label>
                            <Input
                              id={`traveler-age-${idx}`}
                              type="number"
                              value={traveler.age}
                              onChange={(e) => {
                                const newTravelers = [...travelers];
                                newTravelers[idx].age = e.target.value;
                                setTravelers(newTravelers);
                              }}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor={`traveler-gender-${idx}`}>Gender</Label>
                            <select
                              id={`traveler-gender-${idx}`}
                              value={traveler.gender}
                              onChange={(e) => {
                                const newTravelers = [...travelers];
                                newTravelers[idx].gender = e.target.value;
                                setTravelers(newTravelers);
                              }}
                              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                              required
                            >
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                    Continue to Secure Booking
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
