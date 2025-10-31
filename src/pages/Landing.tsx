import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AppBar } from '@/components/AppBar';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      
      {/* Hero Section */}
      <section
        className="pt-32 pb-20 px-6"
        style={{
          background: 'var(--gradient-hero)',
        }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Plan Your Perfect Trip
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let AI create personalized itineraries based on your preferences, budget, and travel style
          </p>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-6 h-auto"
            onClick={() => navigate('/onboarding')}
          >
            Plan a Trip
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose EaseMyTrip Planner?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg border p-6 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Personalized</h3>
              <p className="text-muted-foreground">
                Tailored itineraries based on your interests and preferences
              </p>
            </div>
            
            <div className="bg-card rounded-lg border p-6 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Budget-Friendly</h3>
              <p className="text-muted-foreground">
                Plans that fit your budget without compromising on experience
              </p>
            </div>
            
            <div className="bg-card rounded-lg border p-6 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Instant Planning</h3>
              <p className="text-muted-foreground">
                Get complete itineraries in seconds with AI assistance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 px-6">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 EaseMyTrip Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
