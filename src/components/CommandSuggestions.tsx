import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Clock, 
  Cloud, 
  FileText, 
  Calculator, 
  Search,
  Lightbulb
} from "lucide-react";

interface CommandSuggestionsProps {
  onSelectCommand: (command: string) => void;
}

const suggestions = [
  {
    icon: Calculator,
    text: "Calculator",
    command: "Calculate 2^8 + sqrt(144)",
    description: "Scientific Calculator",
    category: "calculator"
  },
  {
    icon: Search,
    text: "Search Engine",
    command: "Search for latest AI news",
    description: "Web Search",
    category: "search"
  },
  {
    icon: Lightbulb,
    text: "General Chat",
    command: "Tell me about quantum computing",
    description: "AI Assistant",
    category: "chat"
  }
];

export const CommandSuggestions = ({ onSelectCommand }: CommandSuggestionsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Available Commands:
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-20 w-full p-4 rounded-xl hover:bg-jarvis-dark-red/30 hover:border-jarvis-gold/30 border border-transparent transition-all duration-300 group relative overflow-hidden flex flex-col items-center gap-2"
                  onClick={() => onSelectCommand(suggestion.command)}
                >
                  <div className="absolute inset-0 bg-gradient-jarvis opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <Icon className="h-8 w-8 text-jarvis-gold group-hover:text-jarvis-red group-hover:scale-110 transition-all duration-300" />
                  <span className="text-xs font-medium text-jarvis-gold group-hover:text-jarvis-red transition-colors duration-300">
                    {suggestion.text}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="bottom" 
                className="bg-card/95 backdrop-blur-sm border-jarvis-gold/20 text-foreground"
              >
                <p className="font-medium">{suggestion.description}</p>
                <p className="text-xs text-muted-foreground">{suggestion.text}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};