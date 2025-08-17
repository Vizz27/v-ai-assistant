import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface VoiceToTextProps {
  onClose?: () => void;
}

export const VoiceToText = ({ onClose }: VoiceToTextProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      toast.success("Voice recognition started");
    };

    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(prev => prev + finalTranscript + interimTranscript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      toast.error("Speech recognition error occurred");
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const copyToClipboard = async () => {
    if (transcript.trim()) {
      try {
        await navigator.clipboard.writeText(transcript.trim());
        toast.success("Text copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy text");
      }
    }
  };

  const clearTranscript = () => {
    setTranscript("");
  };

  if (!isSupported) {
    return (
      <Card className="p-6 bg-card/95 backdrop-blur-sm border-calc-primary/20">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-calc-primary mb-4">Voice to Text</h3>
          <p className="text-muted-foreground">
            Speech recognition is not supported in this browser. 
            Please try using Chrome, Edge, or Safari.
          </p>
          {onClose && (
            <Button variant="ghost" onClick={onClose} className="mt-4">
              Close
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card/95 backdrop-blur-sm border-calc-primary/20">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-calc-primary">Voice to Text</h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`h-16 w-16 rounded-full ${
              isListening 
                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                : "bg-gradient-calc"
            }`}
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {isListening ? "Listening... Click to stop" : "Click to start recording"}
        </div>

        <Textarea
          placeholder="Transcribed text will appear here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="min-h-[120px] resize-none"
          readOnly={isListening}
        />

        <div className="flex gap-2">
          <Button
            onClick={copyToClipboard}
            disabled={!transcript.trim()}
            variant="outline"
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Text
          </Button>
          <Button
            onClick={clearTranscript}
            disabled={!transcript.trim()}
            variant="outline"
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          {transcript.trim().length} characters
        </div>
      </div>
    </Card>
  );
};