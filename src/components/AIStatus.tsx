import { Badge } from "@/components/ui/badge";
import { Zap, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIStatusProps {
  isOnline?: boolean;
  isProcessing?: boolean;
  model?: string;
}

export const AIStatus = ({ 
  isOnline = true, 
  isProcessing = false, 
  model = "GPT-4" 
}: AIStatusProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-card/30 backdrop-blur-sm border border-border/50">
      <div className="flex items-center gap-2">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-accent" />
        ) : (
          <WifiOff className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-xs text-muted-foreground">
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
      
      <div className="h-4 w-px bg-border" />
      
      <div className="flex items-center gap-2">
        <Zap className={cn(
          "h-4 w-4 transition-all duration-300",
          isProcessing 
            ? "text-ai-glow animate-pulse" 
            : "text-muted-foreground"
        )} />
        <span className="text-xs text-muted-foreground">
          {model}
        </span>
      </div>
      
      {isProcessing && (
        <Badge variant="outline" className="text-xs animate-pulse border-ai-glow/50 text-ai-glow">
          Processing...
        </Badge>
      )}
    </div>
  );
};