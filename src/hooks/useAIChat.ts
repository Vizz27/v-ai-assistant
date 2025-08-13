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

  const processSearch = useCallback(async (query: string): Promise<string> => {
    try {
      // This would use the websearch tool in a real implementation
      return `Searching for "${query}"... Search functionality will be implemented with web API.`;
    } catch (error) {
      return "Search is currently unavailable. Please try again later.";
    }
  }, []);

  const processCommand = useCallback((message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Calculator commands
    if (lowerMessage.includes("calculate") || lowerMessage.includes("math") || 
        /[\d+\-*/^()sqrt sin cos tan log ln pi e]/.test(message)) {
      return processCalculation(message.replace(/calculate|math/gi, '').trim());
    }
    
    // Search commands  
    if (lowerMessage.includes("search")) {
      const searchQuery = message.replace(/search\s+(for\s+)?/gi, '').trim();
      return `I'll search for "${searchQuery}" for you. Web search functionality coming soon!`;
    }
    
    // Default responses for unrecognized commands
    return null;
  }, [processCalculation]);

  const simulateAIResponse = useCallback((userMessage: string): string => {
    // First try to process as a command
    const commandResponse = processCommand(userMessage);
    if (commandResponse) {
      return commandResponse;
    }
    
    // General AI chatbot responses
    const responses = [
      "I'm JARVIS, your personal AI assistant. I can help with calculations, web searches, and general questions. What would you like to know?",
      "That's an interesting question! I'm here to assist you with three main capabilities: advanced calculations, web searching, and general conversation. How can I help?",
      "As your AI assistant, I'm equipped to handle mathematical calculations, search queries, and provide information on various topics. What can I do for you?",
      "I'm ready to help! Whether you need calculations solved, web searches performed, or just want to chat, I'm here for you. What's on your mind?"
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