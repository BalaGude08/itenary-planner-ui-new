import { useNavigate } from 'react-router-dom';
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
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Plan Your Perfect Trip
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Let AI create personalized itineraries based on your preferences, budget, and travel style
          </p>
          
          {/* AI Chat Interface */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 text-left">
            <div className="mb-4">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white text-xl flex-shrink-0">
                  🤖
                </div>
                <div className="bg-muted rounded-2xl px-4 py-3 max-w-md">
                  <p className="text-foreground">
                    Hi! I'm your AI travel planner — tell me about your trip.
                  </p>
                </div>
              </div>
            </div>
            
            <input
              type="text"
              placeholder="I want to plan a 5-day family trip to Thailand"
              className="w-full px-4 py-4 border-2 border-border rounded-xl focus:outline-none focus:border-primary transition-colors text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  const message = e.currentTarget.value.trim();
                  navigate('/planner/new', { state: { initialMessage: message } });
                }
              }}
              autoFocus
            />
            <p className="text-sm text-muted-foreground mt-3 text-center">
              Press Enter to start planning
            </p>
          </div>
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
