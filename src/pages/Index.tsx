import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { CommandSuggestions } from "@/components/CommandSuggestions";
import { AIStatus } from "@/components/AIStatus";
import { TodoList } from "@/components/TodoList";
import { VoiceToText } from "@/components/VoiceToText";
import { useAIChat } from "@/hooks/useAIChat";
import { Brain, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";
const Index = () => {
  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  } = useAIChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [showTodoList, setShowTodoList] = useState(false);
  const [showVoiceToText, setShowVoiceToText] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [messages]);

  // Handle special command responses
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isUser) {
      if (lastMessage.message === "SHOW_TODO_LIST") {
        setShowTodoList(true);
      } else if (lastMessage.message === "SHOW_VOICE_TO_TEXT") {
        setShowVoiceToText(true);
      }
    }
  }, [messages]);
  const handleClearChat = () => {
    clearMessages();
    toast.success("Chat history cleared");
  };
  return <div className="min-h-screen bg-gradient-subtle text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              
              <div>
                <h1 className="text-xl font-semibold">V</h1>
                <p className="text-sm text-muted-foreground">Advanced AI Assistant for Calculations & Search</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleClearChat} disabled={messages.length === 0} className="hover:bg-secondary/50">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <AIStatus isProcessing={isLoading} />
            
            {messages.length === 0 && <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                <CommandSuggestions onSelectCommand={sendMessage} />
              </Card>}
              
            {showTodoList && (
              <div className="mt-4">
                <TodoList onClose={() => setShowTodoList(false)} />
              </div>
            )}
            
            {showVoiceToText && (
              <div className="mt-4">
                <VoiceToText onClose={() => setShowVoiceToText(false)} />
              </div>
            )}
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="flex-1 bg-card/30 backdrop-blur-sm border-border/50 overflow-hidden">
              {messages.length === 0 ? <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center space-y-4 max-w-md">
                    <div className="h-16 w-16 mx-auto rounded-full bg-gradient-calc flex items-center justify-center shadow-glow-calc">
                      <Brain className="h-8 w-8 text-primary-foreground rounded-full" />
                    </div>
                    <h2 className="text-2xl font-semibold">Hello! I'm V</h2>
                    <p className="text-muted-foreground">Your AI assistant with three powerful features. Choose what you'd like to do from the options on the left, or use the commands below.</p>
                  </div>
                </div> : <ScrollArea ref={scrollAreaRef} className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map(message => {
                      // Skip special command responses in chat
                      if (!message.isUser && (message.message === "SHOW_TODO_LIST" || message.message === "SHOW_VOICE_TO_TEXT")) {
                        return null;
                      }
                      return <ChatMessage key={message.id} message={message.message} isUser={message.isUser} timestamp={message.timestamp} />;
                    })}
                    
                    {isLoading && <div className="flex gap-3 p-4 rounded-lg bg-chat-assistant mr-8">
                        <div className="h-8 w-8 rounded-full bg-gradient-calc flex items-center justify-center shadow-glow-calc">
                          <Brain className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-2">V</div>
                          <div className="flex gap-1">
                            <div className="h-2 w-2 bg-calc-primary rounded-full animate-pulse"></div>
                            <div className="h-2 w-2 bg-calc-glow rounded-full animate-pulse delay-75"></div>
                            <div className="h-2 w-2 bg-calc-primary rounded-full animate-pulse delay-150"></div>
                          </div>
                        </div>
                      </div>}
                  </div>
                </ScrollArea>}
            </Card>
            
            <div className="mt-4">
              <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;