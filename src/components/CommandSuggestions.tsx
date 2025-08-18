import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, Cloud, FileText, Calculator, Search, Lightbulb } from "lucide-react";
interface CommandSuggestionsProps {
  onSelectCommand: (command: string) => void;
}
const suggestions = [
  {
    icon: Calculator,
    text: "Calculator",
    command: "calculator",
    description: "Advanced Calculator",
    category: "calculator"
  },
  {
    icon: Search,
    text: "Voice to Text",
    command: "Start voice to text",
    description: "Speech Recognition",
    category: "tools"
  }
];
export const CommandSuggestions = ({
  onSelectCommand
}: CommandSuggestionsProps) => {
  return <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Available Commands:</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="lg" className="h-20 w-full p-4 rounded-xl hover:bg-calc-dark-blue/30 hover:border-calc-primary/30 border border-transparent transition-all duration-300 group relative overflow-hidden flex flex-col items-center gap-2" onClick={() => onSelectCommand(suggestion.command)}>
                  <div className="absolute inset-0 bg-gradient-calc opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <Icon className="h-8 w-8 text-calc-primary group-hover:text-calc-glow group-hover:scale-110 transition-all duration-300" />
                  <span className="text-xs font-medium text-calc-primary group-hover:text-calc-glow transition-colors duration-300">
                    {suggestion.text}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-card/95 backdrop-blur-sm border-calc-primary/20 text-foreground">
                <p className="font-medium">{suggestion.description}</p>
                <p className="text-xs text-muted-foreground">{suggestion.text}</p>
              </TooltipContent>
            </Tooltip>;
      })}
      </div>
    </div>;
};