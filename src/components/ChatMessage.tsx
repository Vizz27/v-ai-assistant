import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

export const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg transition-all duration-300",
      isUser 
        ? "bg-chat-user ml-8 flex-row-reverse" 
        : "bg-chat-assistant mr-8"
    )}>
      <Avatar className={cn(
        "h-8 w-8 shrink-0",
        !isUser && "shadow-glow-calc"
      )}>
        <AvatarFallback className={cn(
          "text-sm font-medium",
          isUser 
            ? "bg-secondary text-secondary-foreground" 
            : "bg-gradient-calc text-primary-foreground shadow-glow-calc"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex-1 space-y-2",
        isUser && "text-right"
      )}>
        <div className="text-sm text-muted-foreground">
          {isUser ? "You" : "SuperCalculator"}
          {timestamp && (
            <span className="ml-2 text-xs opacity-60">
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        
        <div className={cn(
          "text-foreground leading-relaxed",
          !isUser && "animate-in fade-in-50 duration-500"
        )}>
          {message}
        </div>
      </div>
    </div>
  );
};