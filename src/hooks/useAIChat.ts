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

  const processCommand = useCallback((message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Time commands
    if (lowerMessage.includes("time")) {
      return `The current time is ${new Date().toLocaleTimeString()}.`;
    }
    
    // Date commands
    if (lowerMessage.includes("date") || lowerMessage.includes("today")) {
      return `Today is ${new Date().toLocaleDateString("en-US", { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      })}.`;
    }
    
    // Calculator commands
    if (lowerMessage.includes("calculate") || lowerMessage.includes("math")) {
      try {
        // Simple calculation extraction (very basic)
        const mathMatch = message.match(/(\d+(?:\.\d+)?)\s*([+\-*/])\s*(\d+(?:\.\d+)?)/);
        if (mathMatch) {
          const [, num1, operator, num2] = mathMatch;
          const a = parseFloat(num1);
          const b = parseFloat(num2);
          let result;
          
          switch (operator) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/': result = a / b; break;
            default: throw new Error("Invalid operator");
          }
          
          return `${a} ${operator} ${b} = ${result}`;
        }
        
        // Tip calculation
        if (lowerMessage.includes("tip")) {
          const tipMatch = message.match(/(\d+)%.*\$(\d+(?:\.\d+)?)/);
          if (tipMatch) {
            const [, percentage, amount] = tipMatch;
            const tip = (parseFloat(amount) * parseInt(percentage)) / 100;
            const total = parseFloat(amount) + tip;
            return `${percentage}% tip on $${amount} is $${tip.toFixed(2)}. Total: $${total.toFixed(2)}`;
          }
        }
      } catch (error) {
        return "I couldn't perform that calculation. Please try a simpler format like '2 + 2' or '15% tip on $45'.";
      }
    }
    
    // Weather (mock response)
    if (lowerMessage.includes("weather")) {
      return "I don't have access to real-time weather data yet. Please connect an API key to enable weather features.";
    }
    
    // Search commands
    if (lowerMessage.includes("search")) {
      return "I can help you search! However, I need an API key to access real-time search results. For now, I can answer general questions based on my knowledge.";
    }
    
    // Default responses for unrecognized commands
    return null;
  }, []);

  const simulateAIResponse = useCallback((userMessage: string): string => {
    // First try to process as a command
    const commandResponse = processCommand(userMessage);
    if (commandResponse) {
      return commandResponse;
    }
    
    // General AI responses
    const responses = [
      "I understand you're asking about that. As an AI assistant, I'm here to help with various tasks. Currently, I can handle basic commands like time, date, and simple calculations. For more advanced features, you'll need to configure API keys.",
      "That's an interesting question! I'm designed to be your personal AI assistant. I can help with scheduling, calculations, and general questions. What specific task would you like me to help you with?",
      "I'm processing your request. As a local AI assistant, I can perform various tasks. Right now I'm working with basic functionality, but I can be enhanced with additional capabilities through API integrations.",
      "Thanks for that input! I'm your on-device AI assistant, ready to help with daily tasks. I can handle time queries, basic math, and general assistance. How else can I help you today?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
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
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const aiResponse = simulateAIResponse(message);
      
      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        message: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
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
  };
};