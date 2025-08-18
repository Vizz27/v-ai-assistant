import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const processCalculation = useCallback((expression: string): string => {
    try {
      // Enhanced calculation with scientific functions
      let processedExpression = expression
        .replace(/\^/g, '**')
        .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
        .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
        .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)')
        .replace(/log\(([^)]+)\)/g, 'Math.log10($1)')
        .replace(/ln\(([^)]+)\)/g, 'Math.log($1)')
        .replace(/pi/g, 'Math.PI')
        .replace(/e/g, 'Math.E');

      // Safe evaluation
      const result = Function('"use strict"; return (' + processedExpression + ')')();
      
      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Invalid calculation");
      }
      
      return `${expression} = ${result}`;
    } catch (error) {
      return "Invalid calculation. Try examples like: 2+3, sqrt(16), sin(90), 2^3, log(100)";
    }
  }, []);


  const processCommand = useCallback(async (message: string): Promise<string | null> => {
    const lowerMessage = message.toLowerCase();
    
    // Todo list commands - Check first to avoid conflicts
    if (lowerMessage.includes("todo") || lowerMessage.includes("task") || lowerMessage.includes("show todo list")) {
      return "SHOW_TODO_LIST";
    }
    
    // Voice to text commands - Check second to avoid conflicts
    if (lowerMessage.includes("voice to text") || lowerMessage.includes("speech") || lowerMessage.includes("start voice to text")) {
      return "SHOW_VOICE_TO_TEXT";
    }
    
    // Calculator mode command - just enable calculator mode
    if (lowerMessage === "calculator") {
      return "I'm ready to help with calculations! Try expressions like: 2+3, sqrt(16), sin(90), 2^3, log(100), or any mathematical expression.";
    }
    
    // Calculator commands - Check last, and be more specific
    if (lowerMessage.includes("calculate") || lowerMessage.includes("math") || 
        (lowerMessage.match(/[\d+\-*/^()sqrt sin cos tan log ln pi e]/) && 
         !lowerMessage.includes("todo") && !lowerMessage.includes("voice"))) {
      return processCalculation(message.replace(/calculate|math/gi, '').trim());
    }
    
    // Default responses for unrecognized commands
    return null;
  }, [processCalculation]);

  const simulateAIResponse = useCallback(async (userMessage: string): Promise<string> => {
    // Process calculation commands
    const commandResponse = await processCommand(userMessage);
    if (commandResponse) {
      return commandResponse;
    }
    
    // Default response for non-calculation queries
    return "I'm V, your advanced AI assistant. I can handle calculations including scientific functions like sqrt(), sin(), cos(), tan(), log(), ln(), pi, e. I also have a todo list and voice-to-text features. Try asking me to calculate something like '2^8 + sqrt(144)', 'show todo list', or 'start voice to text'!";
  }, [processCommand]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      message,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Simulate processing delay for calculations
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiResponse = await simulateAIResponse(message);
      
      // Don't add special command responses as chat messages
      if (aiResponse !== "SHOW_TODO_LIST" && aiResponse !== "SHOW_VOICE_TO_TEXT") {
        const assistantMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          message: aiResponse,
          isUser: false,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      toast.error("Failed to process your message. Please try again.");
      console.error("AI response error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [simulateAIResponse]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    simulateAIResponse, // Export this so we can check for special commands
  };
};