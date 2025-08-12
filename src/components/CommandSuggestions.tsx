import { Button } from "@/components/ui/button";
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
    command: "What time is it?"
  },
  {
    icon: Cloud,
    text: "Check the weather",
    command: "What's the weather like today?"
  },
  {
    icon: Search,
    text: "Search the web",
    command: "Search for information about"
  },
  {
    icon: Calculator,
    text: "Do calculations",
    command: "Calculate 15% tip on $45"
  },
  {
    icon: FileText,
    text: "Summarize text",
    command: "Summarize this document for me"
  },
  {
    icon: Lightbulb,
    text: "Get ideas",
    command: "Give me creative ideas for"
  }
];

export const CommandSuggestions = ({ onSelectCommand }: CommandSuggestionsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Try these commands:
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              className="h-auto p-3 justify-start text-left hover:bg-secondary/50 transition-all duration-300 group"
              onClick={() => onSelectCommand(suggestion.command)}
            >
              <Icon className="h-4 w-4 mr-3 text-ai-glow group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">{suggestion.text}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};