import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItineraryStore } from '@/store/itinerary.store';
import { Button } from '@/components/ui/button';
import { AppBar } from '@/components/AppBar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const steps = [
  { title: 'Dates & Duration', key: 'dates' },
  { title: 'Budget', key: 'budget' },
  { title: 'Travel Themes', key: 'themes' },
  { title: 'Constraints', key: 'constraints' },
  { title: 'Departure City', key: 'departure' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateOnboarding, onboardingData } = useItineraryStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    duration: '',
    budget: '',
    themes: [] as string[],
    constraints: '',
    departureCity: '',
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save and navigate to planner
      updateOnboarding({
        dates: { start: formData.startDate, end: formData.endDate },
        duration: parseInt(formData.duration) || 7,
        budget: formData.budget as any,
        themes: formData.themes,
        constraints: formData.constraints.split(',').map((s) => s.trim()),
        departureCity: formData.departureCity,
      });
      navigate('/planner/demo-trip-123');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const toggleTheme = (theme: string) => {
    setFormData((prev) => ({
      ...prev,
      themes: prev.themes.includes(theme)
        ? prev.themes.filter((t) => t !== theme)
        : [...prev.themes, theme],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      
      <div className="pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {steps[currentStep].title}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-card rounded-lg border p-8 min-h-[400px]">
            <h2 className="text-2xl font-bold mb-6">{steps[currentStep].title}</h2>

            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    placeholder="7"
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                {['budget', 'moderate', 'luxury'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData({ ...formData, budget: option })}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.budget === option
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold capitalize">{option}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {option === 'budget' && 'Cost-effective options'}
                      {option === 'moderate' && 'Balance of quality and price'}
                      {option === 'luxury' && 'Premium experiences'}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-3">
                {['Adventure', 'Culture', 'Relaxation', 'Food', 'Nature', 'Shopping'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => toggleTheme(theme)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      formData.themes.includes(theme)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <Label htmlFor="constraints">
                  Any constraints or preferences? (comma-separated)
                </Label>
                <Input
                  id="constraints"
                  value={formData.constraints}
                  onChange={(e) =>
                    setFormData({ ...formData, constraints: e.target.value })
                  }
                  placeholder="e.g., no red-eye flights, kid-friendly, vegetarian food"
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <Label htmlFor="departureCity">Departure City</Label>
                <Input
                  id="departureCity"
                  value={formData.departureCity}
                  onChange={(e) =>
                    setFormData({ ...formData, departureCity: e.target.value })
                  }
                  placeholder="e.g., New Delhi"
                />
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mt-6">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Back
            </Button>
            <Button onClick={handleNext} className="flex-1">
              {currentStep === steps.length - 1 ? 'Create Itinerary' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
