import { useState, useEffect, useRef } from 'react';
import { useItineraryStore } from '@/store/itinerary.store';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

type ChatStep = 
  | 'initial'
  | 'destination'
  | 'dates'
  | 'travelers'
  | 'children-ages'
  | 'budget'
  | 'themes'
  | 'constraints'
  | 'flights'
  | 'accommodation'
  | 'confirmation'
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
      updateOnboarding({ departureCity: initialMessage });
      addChatMessage('user', initialMessage);
      simulateAIResponse('Perfect! And where would you like to travel to?', 'destination');
    } else if (chatMessages.length === 0) {
      addChatMessage('assistant', "👋 Hi, I'm your AI travel planner. Where are you planning to travel from?");
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
      updateOnboarding({ departureCity: userInput });
      simulateAIResponse('Perfect! And where would you like to travel to?', 'destination');
    } else if (currentStep === 'destination') {
      updateOnboarding({ destinationCity: userInput });
      simulateAIResponse('Great choice! When would you like to travel?', 'dates');
    } else if (currentStep === 'complete') {
      // Handle follow-up questions after itinerary is generated
      simulateAIResponse('I can help you modify your itinerary! You can ask me to change activities, adjust timing, swap hotels, or add new experiences. What would you like to adjust?', 'complete');
    }
  };

  const handleDateSelect = (start: Date, end: Date) => {
    updateOnboarding({ dates: { start: start.toISOString(), end: end.toISOString() } });
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    updateOnboarding({ duration: daysDiff });
    addChatMessage('user', `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`);
    simulateAIResponse(`You're planning a ${daysDiff}-day trip! Who's traveling with you?`, 'travelers');
  };

  const handleTravelersSelect = (travelers: { adults: number; children: number; infants: number }) => {
    updateOnboarding({ travelers });
    const parts = [];
    if (travelers.adults > 0) parts.push(`${travelers.adults} Adult${travelers.adults > 1 ? 's' : ''}`);
    if (travelers.children > 0) parts.push(`${travelers.children} Child${travelers.children > 1 ? 'ren' : ''}`);
    if (travelers.infants > 0) parts.push(`${travelers.infants} Infant${travelers.infants > 1 ? 's' : ''}`);
    addChatMessage('user', parts.join(', '));
    
    if (travelers.children > 0) {
      simulateAIResponse(`Great! Could you tell me the ages of the ${travelers.children} child${travelers.children > 1 ? 'ren' : ''}? This helps me suggest better activities.`, 'children-ages');
    } else {
      simulateAIResponse("Perfect! What's your budget range for this trip?", 'budget');
    }
  };

  const handleChildrenAgesSubmit = (ages: number[]) => {
    updateOnboarding({ 
      travelers: { 
        ...onboardingData.travelers!, 
        childrenAges: ages 
      } 
    });
    addChatMessage('user', ages.map(age => `${age} years`).join(', '));
    simulateAIResponse("Got it! What's your budget range for this trip?", 'budget');
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
      addChatMessage('user', 'No specific preferences');
    }
    simulateAIResponse('Do you want me to include flights in your plan?', 'flights');
  };

  const handleFlightsSelect = (include: boolean, preference?: string) => {
    updateOnboarding({ flights: { include, preference } });
    if (include) {
      addChatMessage('user', preference ? `Yes, ${preference}` : 'Yes, include flights');
    } else {
      addChatMessage('user', "No, I'll arrange flights myself");
    }
    simulateAIResponse('Would you like me to include hotel suggestions?', 'accommodation');
  };

  const handleAccommodationSelect = (include: boolean, starRating?: string) => {
    updateOnboarding({ accommodation: { include, starRating } });
    if (include) {
      addChatMessage('user', starRating ? `Yes, ${starRating}` : 'Yes, include hotels');
    } else {
      addChatMessage('user', "No, I'll book hotels myself");
    }
    
    // Generate confirmation summary
    const summary = generateConfirmationSummary();
    simulateAIResponse(summary, 'confirmation');
  };

  const generateConfirmationSummary = () => {
    const { departureCity, destinationCity, duration, travelers, budget, themes } = onboardingData;
    const parts = [`Okay, you're planning a ${duration}-day`];
    
    if (travelers) {
      const tCount = travelers.adults + travelers.children + travelers.infants;
      if (tCount > 1 || travelers.children > 0 || travelers.infants > 0) {
        parts.push('family trip');
      } else {
        parts.push('trip');
      }
    } else {
      parts.push('trip');
    }
    
    parts.push(`from ${departureCity} to ${destinationCity}`);
    
    if (budget) {
      const budgetLabels = { budget: 'budget-friendly', moderate: 'moderate', luxury: 'luxury' };
      parts.push(`with a ${budgetLabels[budget]} budget`);
    }
    
    if (themes && themes.length > 0) {
      parts.push(`focusing on ${themes.slice(0, 2).join(' and ')}`);
    }
    
    return parts.join(' ') + '. Shall I create your itinerary?';
  };

  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      addChatMessage('user', '✅ Yes, please');
      setCurrentStep('generating');
      simulateAIResponse('✨ Planning your perfect trip...', 'generating');
      
      setTimeout(() => {
        addChatMessage('assistant', '✨ Your itinerary is ready! Check out the details on the right panel.');
        setCurrentStep('complete');
        onComplete?.();
      }, 3000);
    } else {
      addChatMessage('user', '✏️ Make changes');
      simulateAIResponse('No problem! What would you like to change?', 'initial');
    }
  };

  const renderInteractiveElement = () => {
    switch (currentStep) {
      case 'dates':
        return <DateSelector onSelect={handleDateSelect} />;
      case 'travelers':
        return <TravelersSelector onSelect={handleTravelersSelect} />;
      case 'children-ages':
        return <ChildrenAgesInput 
          childrenCount={onboardingData.travelers?.children || 0}
          onSubmit={handleChildrenAgesSubmit} 
        />;
      case 'budget':
        return <BudgetSelector onSelect={handleBudgetSelect} />;
      case 'themes':
        return <ThemeSelector onSelect={handleThemesSelect} />;
      case 'constraints':
        return <ConstraintSelector onSelect={handleConstraintsSelect} />;
      case 'flights':
        return <FlightsSelector onSelect={handleFlightsSelect} />;
      case 'accommodation':
        return <AccommodationSelector onSelect={handleAccommodationSelect} />;
      case 'confirmation':
        return <ConfirmationButtons onConfirm={handleConfirmation} />;
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
      
      {currentStep !== 'generating' && (
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
              placeholder={currentStep === 'complete' ? "Ask me to modify your itinerary..." : "Type your message..."}
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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectionPhase, setSelectionPhase] = useState<'start' | 'end'>('start');

  const maxNights = 30;

  const handleDateClick = (date: Date | undefined) => {
    if (!date) return;
    
    if (selectionPhase === 'start') {
      setStartDate(date);
      setEndDate(undefined);
      setSelectionPhase('end');
    } else {
      // Selecting end date
      if (startDate) {
        if (date < startDate) {
          // If end is before start, restart selection
          setStartDate(date);
          setEndDate(undefined);
          setSelectionPhase('end');
        } else {
          const nights = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
          if (nights === 0) {
            // Same day selected, minimum 1 night
            return;
          }
          if (nights > maxNights) {
            // Exceeded max nights, restart
            setStartDate(date);
            setEndDate(undefined);
            setSelectionPhase('end');
          } else {
            setEndDate(date);
          }
        }
      }
    }
  };

  const handleClear = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectionPhase('start');
  };

  const handleApply = () => {
    if (startDate && endDate && endDate > startDate) {
      onSelect(startDate, endDate);
    }
  };

  const getDaysBetween = () => {
    if (startDate && endDate) {
      const days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      return days;
    }
    return 0;
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} (${getDaysBetween()} days)`;
    }
    return '';
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card border rounded-2xl shadow-lg overflow-hidden max-w-sm">
        <div className="p-4 pb-3">
          <p className="text-sm font-medium mb-1">Select your travel dates:</p>
          <p className="text-xs text-muted-foreground">
            {selectionPhase === 'start' ? 'Tap to select start date' : 'Tap to select end date'}
          </p>
        </div>
        
        <div className="px-3 pb-3">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-2 px-2">
            <button
              onClick={goToPreviousMonth}
              className="p-1.5 hover:bg-muted rounded-md transition-colors"
              aria-label="Previous month"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <div className="text-sm font-semibold">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <button
              onClick={goToNextMonth}
              className="p-1.5 hover:bg-muted rounded-md transition-colors"
              aria-label="Next month"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          {/* Calendar */}
          <div className="max-h-80 overflow-auto">
            <Calendar
              mode="single"
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              selected={startDate}
              onSelect={handleDateClick}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="pointer-events-auto p-0 border-0"
              modifiers={{
                start: startDate ? [startDate] : [],
                end: endDate ? [endDate] : [],
                range: startDate && endDate ? 
                  Array.from({ length: getDaysBetween() + 1 }, (_, i) => {
                    const date = new Date(startDate);
                    date.setDate(date.getDate() + i);
                    return date;
                  }) : []
              }}
              modifiersClassNames={{
                start: 'bg-primary text-primary-foreground rounded-l-full font-semibold',
                end: 'bg-primary text-primary-foreground rounded-r-full font-semibold',
                range: 'bg-primary/20 text-foreground'
              }}
            />
          </div>

          {/* Selected range chip */}
          {startDate && endDate && (
            <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-primary/10 to-cyan-500/10 text-foreground px-3 py-2 rounded-full mt-3 border border-primary/20">
              <span>📅</span>
              <span className="font-medium">{formatDateRange()}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-t text-sm">
          <button
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            Clear
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!startDate || !endDate}
              className="text-primary font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TravelersSelector = ({ onSelect }: { onSelect: (travelers: { adults: number; children: number; infants: number }) => void }) => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const Counter = ({ label, emoji, value, onChange }: { label: string; emoji: string; value: number; onChange: (val: number) => void }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <span className="text-xl">{emoji}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0 || (label.includes('Adult') && value === 1)}
          className="h-8 w-8 p-0"
        >
          -
        </Button>
        <span className="w-8 text-center font-medium">{value}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange(value + 1)}
          className="h-8 w-8 p-0"
        >
          +
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card border rounded-2xl p-4 shadow-lg w-80">
        <p className="text-sm font-medium mb-3">Who's traveling?</p>
        <div className="space-y-1">
          <Counter label="Adults (12+)" emoji="👨" value={adults} onChange={setAdults} />
          <Counter label="Children (2-11)" emoji="👦" value={children} onChange={setChildren} />
          <Counter label="Infants (0-2)" emoji="👶" value={infants} onChange={setInfants} />
        </div>
        <Button 
          onClick={() => onSelect({ adults, children, infants })} 
          className="w-full mt-4"
          size="sm"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

const ChildrenAgesInput = ({ childrenCount, onSubmit }: { childrenCount: number; onSubmit: (ages: number[]) => void }) => {
  const [ages, setAges] = useState<number[]>(Array(childrenCount).fill(5));

  const handleAgeChange = (index: number, age: number) => {
    const newAges = [...ages];
    newAges[index] = Math.max(2, Math.min(11, age));
    setAges(newAges);
  };

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card border rounded-2xl p-4 shadow-lg w-80">
        <p className="text-sm font-medium mb-3">Enter children's ages:</p>
        <div className="space-y-2">
          {ages.map((age, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Child {idx + 1}:</span>
              <input
                type="number"
                value={age}
                onChange={(e) => handleAgeChange(idx, parseInt(e.target.value) || 2)}
                min="2"
                max="11"
                className="flex-1 px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
              <span className="text-xs text-muted-foreground">years</span>
            </div>
          ))}
        </div>
        <Button 
          onClick={() => onSubmit(ages)} 
          className="w-full mt-4"
          size="sm"
        >
          Continue
        </Button>
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

const FlightsSelector = ({ onSelect }: { onSelect: (include: boolean, preference?: string) => void }) => {
  const [showPreferences, setShowPreferences] = useState(false);

  const handleYes = () => {
    setShowPreferences(true);
  };

  const handlePreference = (pref: string) => {
    onSelect(true, pref);
  };

  if (showPreferences) {
    return (
      <div className="flex justify-start mb-4">
        <div className="bg-card border rounded-2xl p-4 shadow-lg">
          <p className="text-sm font-medium mb-3">Flight preferences:</p>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => handlePreference('Morning flights')} size="sm">
              🌅 Morning flights
            </Button>
            <Button variant="outline" onClick={() => handlePreference('Evening flights')} size="sm">
              🌆 Evening flights
            </Button>
            <Button variant="outline" onClick={() => handlePreference('Direct flights only')} size="sm">
              ✈️ Direct flights only
            </Button>
            <Button variant="outline" onClick={() => handlePreference('Budget airlines')} size="sm">
              💰 Budget airlines
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card border rounded-2xl p-4 shadow-lg">
        <p className="text-sm font-medium mb-3">Include flights?</p>
        <div className="flex gap-2">
          <Button variant="default" onClick={handleYes} size="sm">
            ✈️ Yes, include flights
          </Button>
          <Button variant="outline" onClick={() => onSelect(false)} size="sm">
            No, I'll arrange them
          </Button>
        </div>
      </div>
    </div>
  );
};

const AccommodationSelector = ({ onSelect }: { onSelect: (include: boolean, starRating?: string) => void }) => {
  const [showRatings, setShowRatings] = useState(false);

  const handleYes = () => {
    setShowRatings(true);
  };

  const handleRating = (rating: string) => {
    onSelect(true, rating);
  };

  if (showRatings) {
    return (
      <div className="flex justify-start mb-4">
        <div className="bg-card border rounded-2xl p-4 shadow-lg">
          <p className="text-sm font-medium mb-3">Hotel preference:</p>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => handleRating('3-star hotels')} size="sm">
              ⭐⭐⭐ 3-star
            </Button>
            <Button variant="outline" onClick={() => handleRating('4-star hotels')} size="sm">
              ⭐⭐⭐⭐ 4-star
            </Button>
            <Button variant="outline" onClick={() => handleRating('5-star hotels')} size="sm">
              ⭐⭐⭐⭐⭐ 5-star
            </Button>
            <Button variant="outline" onClick={() => handleRating('Both Budget & Premium')} size="sm">
              🏨 Show all
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card border rounded-2xl p-4 shadow-lg">
        <p className="text-sm font-medium mb-3">Include hotel suggestions?</p>
        <div className="flex gap-2">
          <Button variant="default" onClick={handleYes} size="sm">
            🏨 Yes, include hotels
          </Button>
          <Button variant="outline" onClick={() => onSelect(false)} size="sm">
            No, I'll book myself
          </Button>
        </div>
      </div>
    </div>
  );
};

const ConfirmationButtons = ({ onConfirm }: { onConfirm: (confirmed: boolean) => void }) => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card border rounded-2xl p-4 shadow-lg">
        <div className="flex gap-2">
          <Button variant="default" onClick={() => onConfirm(true)} size="sm" className="gap-1">
            ✅ Yes, please
          </Button>
          <Button variant="outline" onClick={() => onConfirm(false)} size="sm" className="gap-1">
            ✏️ Make changes
          </Button>
        </div>
      </div>
    </div>
  );
};
