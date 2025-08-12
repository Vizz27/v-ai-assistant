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
    icon: Clock,
    text: "What time is it?",
    command: "What time is it?",
    description: "Check current time"
  },
  {
    icon: Cloud,
    text: "Check the weather",
    command: "What's the weather like today?",
    description: "Get weather info"
  },
  {
    icon: Search,
    text: "Search the web",
    command: "Search for information about",
    description: "Web search"
  },
  {
    icon: Calculator,
    text: "Do calculations",
    command: "Calculate 15% tip on $45",
    description: "Math & calculations"
  },
  {
    icon: FileText,
    text: "Summarize text",
    command: "Summarize this document for me",
    description: "Text analysis"
  },
  {
    icon: Lightbulb,
    text: "Get ideas",
    command: "Give me creative ideas for",
    description: "Creative assistance"
  }
];

export const CommandSuggestions = ({ onSelectCommand }: CommandSuggestionsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Available Commands:
      </h3>
      
      <div className="grid grid-cols-3 gap-3">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-16 w-16 p-0 rounded-xl hover:bg-jarvis-dark-red/30 hover:border-jarvis-gold/30 border border-transparent transition-all duration-300 group relative overflow-hidden"
                  onClick={() => onSelectCommand(suggestion.command)}
                >
                  <div className="absolute inset-0 bg-gradient-jarvis opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <Icon className="h-6 w-6 text-jarvis-gold group-hover:text-jarvis-red group-hover:scale-110 transition-all duration-300" />
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