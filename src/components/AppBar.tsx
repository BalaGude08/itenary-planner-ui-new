import { useItineraryStore } from '@/store/itinerary.store';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const translations = {
  en: { login: 'Login or Signup' },
  hi: { login: 'लॉगिन या साइनअप' },
  te: { login: 'లాగిన్ లేదా సైన్అప్' },
};

export const AppBar = () => {
  const { locale, setLocale } = useItineraryStore();
  const navigate = useNavigate();
  const t = translations[locale];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-primary text-2xl font-bold">
            EaseMyTrip
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as any)}
            className="px-3 py-1.5 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="en">EN</option>
            <option value="hi">HI</option>
            <option value="te">TE</option>
          </select>
          
          <Button variant="default" size="sm" onClick={() => navigate('/login')}>
            {t.login}
          </Button>
        </div>
      </div>
    </header>
  );
};
