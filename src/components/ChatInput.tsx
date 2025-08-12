import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything or give me a command..."
          className={cn(
            "min-h-[60px] max-h-[200px] pr-24 resize-none",
            "border-border/50 bg-card/50 backdrop-blur-sm",
            "focus:ring-jarvis-gold focus:border-jarvis-gold",
            "transition-all duration-300"
          )}
          disabled={isLoading}
        />
        
        <div className="absolute right-2 bottom-2 flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleListening}
            className={cn(
              "h-8 w-8 p-0 transition-all duration-300",
              isListening 
                ? "text-destructive hover:text-destructive/80" 
                : "text-muted-foreground hover:text-jarvis-gold"
            )}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
          
          <Button
            type="submit"
            size="sm"
            disabled={!message.trim() || isLoading}
            className={cn(
              "h-8 w-8 p-0 bg-gradient-jarvis hover:shadow-glow-primary",
              "transition-all duration-300 disabled:opacity-50"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
};