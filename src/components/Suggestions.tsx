import { Button } from '@/components/ui/button';
import { Suggestion } from '@/services/mockService';
import { cn } from '@/lib/utils';

interface SuggestionsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: Suggestion) => void;
}

export const Suggestions = ({ suggestions, onSuggestionClick }: SuggestionsProps) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-card border rounded-2xl p-4 shadow-lg max-w-md">
        <p className="text-sm font-medium mb-3">Suggestions:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
              className={cn(
                "text-left",
                suggestion.type === 'modification' && "border-orange-200 hover:border-orange-300",
                suggestion.type === 'recommendation' && "border-green-200 hover:border-green-300"
              )}
            >
              {suggestion.type === 'modification' && "🔄 "}
              {suggestion.type === 'recommendation' && "💡 "}
              {suggestion.type === 'question' && "❓ "}
              {suggestion.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};