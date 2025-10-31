import { useState, useEffect, useRef } from 'react';
import { useItineraryStore } from '@/store/itinerary.store';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

type ChatStep = 
  | 'initial'
  | 'dates'
  | 'budget'
  | 'themes'
  | 'constraints'
  | 'departure'
  | 'generating'
  | 'complete';

interface ConversationalChatProps {
  initialMessage?: string;
  onComplete?: () => void;
}

export const ConversationalChat = ({ initialMessage, onComplete }: ConversationalChatProps) => {
  const { chatMessages, addChatMessage, updateOnboarding, onboardingData } = useItineraryStore();
  const [input, setInput] = useState('');
  const [currentStep, setCurrentStep] = useState<ChatStep>('initial');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (initialMessage && chatMessages.length === 0) {
      addChatMessage('user', initialMessage);
      simulateAIResponse('Great! Let me help you plan that trip. First, when would you like to travel?', 'dates');
    } else if (chatMessages.length === 0) {
      addChatMessage('assistant', "Hi! I'm your AI travel planner 🤖 — tell me about your trip.");
    }
  }, []);

  const simulateAIResponse = (message: string, nextStep?: ChatStep) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addChatMessage('assistant', message);
      if (nextStep) setCurrentStep(nextStep);
    }, 800);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    addChatMessage('user', input);
    const userInput = input;
    setInput('');
    
    if (currentStep === 'initial') {
      simulateAIResponse('Great! Let me help you plan that trip. First, when would you like to travel?', 'dates');
    }
  };

  const handleDateSelect = (start: Date, end: Date) => {
    updateOnboarding({ dates: { start: start.toISOString(), end: end.toISOString() } });
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    addChatMessage('user', `From ${start.toLocaleDateString()} to ${end.toLocaleDateString()} (${daysDiff} days)`);
    simulateAIResponse("Perfect! What's your budget range for this trip?", 'budget');
  };

  const handleBudgetSelect = (budget: 'budget' | 'moderate' | 'luxury') => {
    updateOnboarding({ budget });
    const budgetLabels = { budget: 'Budget-friendly', moderate: 'Moderate', luxury: 'Luxury' };
    addChatMessage('user', budgetLabels[budget]);
    simulateAIResponse('Great choice! What kind of experiences are you looking for?', 'themes');
  };

  const handleThemesSelect = (themes: string[]) => {
    updateOnboarding({ themes });
    addChatMessage('user', themes.join(', '));
    simulateAIResponse('Awesome! Any special preferences or constraints I should know about?', 'constraints');
  };

  const handleConstraintsSelect = (constraints: string[]) => {
    updateOnboarding({ constraints });
    if (constraints.length > 0) {
      addChatMessage('user', constraints.join(', '));
    } else {
      addChatMessage('user', 'No specific constraints');
    }
    simulateAIResponse('Last question — which city will you be departing from?', 'departure');
  };

  const handleDepartureInput = (city: string) => {
    updateOnboarding({ departureCity: city });
    addChatMessage('user', city);
    setCurrentStep('generating');
    simulateAIResponse('Perfect! Let me create a personalized itinerary for you...', 'generating');
    
    setTimeout(() => {
      addChatMessage('assistant', '✨ Your itinerary is ready! Check out the details on the right panel.');
      setCurrentStep('complete');
      onComplete?.();
    }, 2500);
  };

  const renderInteractiveElement = () => {
    switch (currentStep) {
      case 'dates':
        return <DateSelector onSelect={handleDateSelect} />;
      case 'budget':
        return <BudgetSelector onSelect={handleBudgetSelect} />;
      case 'themes':
        return <ThemeSelector onSelect={handleThemesSelect} />;
      case 'constraints':
        return <ConstraintSelector onSelect={handleConstraintsSelect} />;
      case 'departure':
        return <DepartureInput onSubmit={handleDepartureInput} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-4 border-b bg-card">
        <h2 className="font-semibold text-lg">AI Travel Assistant</h2>
        <p className="text-sm text-muted-foreground">
          Let's plan your perfect trip together
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white text-xl flex-shrink-0 mr-3">
                🤖
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white text-xl flex-shrink-0 mr-3">
              🤖
            </div>
            <div className="bg-muted rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        {renderInteractiveElement()}
        
        <div ref={chatEndRef} />
      </div>
      
      {currentStep !== 'generating' && currentStep !== 'complete' && (
        <div className="p-4 border-t bg-card space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            />
            <Button onClick={handleSend} className="px-6">
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// Interactive Components

const DateSelector = ({ onSelect }: { onSelect: (start: Date, end: Date) => void }) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  useEffect(() => {
    if (startDate && endDate) {
      onSelect(startDate, endDate);
    }
  }, [startDate, endDate]);

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card border rounded-2xl p-4 shadow-lg max-w-md">
        <p className="text-sm font-medium mb-3">Select your travel dates:</p>
        <div className="flex gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              disabled={(date) => !startDate || date < startDate}
              className="rounded-md border"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const BudgetSelector = ({ onSelect }: { onSelect: (budget: 'budget' | 'moderate' | 'luxury') => void }) => {
  const options = [
    { value: 'budget' as const, label: 'Budget-friendly', emoji: '💰' },
    { value: 'moderate' as const, label: 'Moderate', emoji: '💳' },
    { value: 'luxury' as const, label: 'Luxury', emoji: '💎' },
  ];

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card border rounded-2xl p-4 shadow-lg">
        <p className="text-sm font-medium mb-3">Choose your budget range:</p>
        <div className="flex gap-2">
          {options.map((option) => (
            <Button
              key={option.value}
              variant="outline"
              onClick={() => onSelect(option.value)}
              className="flex-col h-auto py-3 px-4 hover:bg-primary hover:text-primary-foreground"
            >
              <span className="text-2xl mb-1">{option.emoji}</span>
              <span className="text-sm">{option.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ThemeSelector = ({ onSelect }: { onSelect: (themes: string[]) => void }) => {
  const [selected, setSelected] = useState<string[]>([]);
  
  const themes = [
    { value: 'heritage', label: 'Heritage Sites', emoji: '🏛️' },
    { value: 'beaches', label: 'Beaches', emoji: '🏖️' },
    { value: 'adventure', label: 'Adventure', emoji: '🏔️' },
    { value: 'food', label: 'Food & Culture', emoji: '🍜' },
    { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
    { value: 'nightlife', label: 'Nightlife', emoji: '🌃' },
  ];

  const toggleTheme = (theme: string) => {
    setSelected(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card border rounded-2xl p-4 shadow-lg max-w-md">
        <p className="text-sm font-medium mb-3">Select your interests (choose multiple):</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {themes.map((theme) => (
            <Button
              key={theme.value}
              variant={selected.includes(theme.value) ? 'default' : 'outline'}
              onClick={() => toggleTheme(theme.value)}
              className="justify-start h-auto py-2 px-3"
              size="sm"
            >
              <span className="mr-2">{theme.emoji}</span>
              <span className="text-xs">{theme.label}</span>
            </Button>
          ))}
        </div>
        <Button 
          onClick={() => onSelect(selected)} 
          disabled={selected.length === 0}
          className="w-full"
          size="sm"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

const ConstraintSelector = ({ onSelect }: { onSelect: (constraints: string[]) => void }) => {
  const [selected, setSelected] = useState<string[]>([]);
  
  const constraints = [
    { value: 'kid-friendly', label: 'Kid-friendly' },
    { value: 'vegetarian', label: 'Vegetarian food' },
    { value: 'no-red-eye', label: 'Avoid red-eye flights' },
    { value: 'accessible', label: 'Wheelchair accessible' },
  ];

  const toggleConstraint = (constraint: string) => {
    setSelected(prev => 
      prev.includes(constraint) 
        ? prev.filter(c => c !== constraint)
        : [...prev, constraint]
    );
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card border rounded-2xl p-4 shadow-lg max-w-md">
        <p className="text-sm font-medium mb-3">Any special preferences? (optional):</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {constraints.map((constraint) => (
            <Button
              key={constraint.value}
              variant={selected.includes(constraint.value) ? 'default' : 'outline'}
              onClick={() => toggleConstraint(constraint.value)}
              className="justify-start h-auto py-2 px-3"
              size="sm"
            >
              <span className="text-xs">{constraint.label}</span>
            </Button>
          ))}
        </div>
        <Button 
          onClick={() => onSelect(selected)} 
          className="w-full"
          size="sm"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

const DepartureInput = ({ onSubmit }: { onSubmit: (city: string) => void }) => {
  const [city, setCity] = useState('');

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card border rounded-2xl p-4 shadow-lg max-w-md w-full">
        <p className="text-sm font-medium mb-3">Where will you be departing from?</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && city.trim()) {
                onSubmit(city.trim());
              }
            }}
            placeholder="e.g., Mumbai, New Delhi..."
            className="flex-1 px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            autoFocus
          />
          <Button 
            onClick={() => city.trim() && onSubmit(city.trim())}
            disabled={!city.trim()}
            size="sm"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};
