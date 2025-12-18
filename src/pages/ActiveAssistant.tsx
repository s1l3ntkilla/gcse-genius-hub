import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Send, Trash2, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { MainLayout } from '@/components/layout';

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TranscriptChunk {
  id: string;
  text: string;
  timestamp: Date;
}

const ActiveAssistant: React.FC = () => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptChunk[]>([]);
  const [interimText, setInterimText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Scroll to bottom of transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Initialize speech recognition
  const initSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser. Please use Chrome or Edge.",
        variant: "destructive"
      });
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const text = lastResult[0].transcript.trim();
      
      if (lastResult.isFinal) {
        setInterimText('');
        if (text) {
          setTranscript(prev => [...prev, {
            id: crypto.randomUUID(),
            text,
            timestamp: new Date()
          }]);
        }
      } else {
        // Show interim (live) text as it's being spoken
        setInterimText(text);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use the lesson listener.",
          variant: "destructive"
        });
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      // Restart if still supposed to be listening
      if (isListening && recognitionRef.current) {
        recognitionRef.current.start();
      }
    };

    return recognition;
  }, [toast, isListening]);

  // Toggle listening
  const toggleListening = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      toast({
        title: "Stopped Listening",
        description: "Lesson capture paused."
      });
    } else {
      if (!recognitionRef.current) {
        recognitionRef.current = initSpeechRecognition();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          toast({
            title: "Listening Started",
            description: "Capturing lesson audio..."
          });
        } catch (error) {
          console.error('Error starting recognition:', error);
        }
      }
    }
  };

  // Clear transcript
  const clearTranscript = () => {
    setTranscript([]);
    toast({
      title: "Transcript Cleared",
      description: "Lesson context has been reset."
    });
  };

  // Get full transcript text for context
  const getFullTranscript = () => {
    return transcript.map(chunk => chunk.text).join(' ');
  };

  // Send message to AI with lesson context
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const lessonContext = getFullTranscript();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/active-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: messages.map(m => ({ role: m.role, content: m.content })).concat({
              role: 'user',
              content: input
            }),
            lessonContext
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = crypto.randomUUID();

      // Add empty assistant message
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }]);

      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => prev.map(m => 
                m.id === assistantId 
                  ? { ...m, content: assistantContent }
                  : m
              ));
            }
          } catch {
            // Incomplete JSON, will be handled in next chunk
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <MainLayout>
      <div className="h-full flex flex-col lg:flex-row gap-4 p-4">
      {/* Lesson Transcript Panel */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">Lesson Capture</CardTitle>
              {isListening && (
                <Badge variant="default" className="bg-destructive animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full mr-2" />
                  Recording
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className="h-8 w-8"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={clearTranscript}
                className="h-8 w-8"
                disabled={transcript.length === 0}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant={isListening ? "destructive" : "default"}
                onClick={toggleListening}
                className="gap-2"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start Listening
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-4">
            {transcript.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-center p-8">
                <div>
                  <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No lesson captured yet</p>
                  <p className="text-sm mt-1">Click "Start Listening" to begin capturing your lesson audio</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {transcript.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-3 bg-muted/50 rounded-lg border border-border/50"
                  >
                    <p className="text-sm leading-relaxed">{chunk.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {chunk.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))}
                {interimText && (
                  <div className="p-3 bg-primary/10 rounded-lg border border-primary/30 animate-pulse">
                    <p className="text-sm leading-relaxed text-muted-foreground italic">{interimText}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">Speaking...</p>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Chat Panel */}
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
            <CardTitle className="text-lg">Ask About the Lesson</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            {transcript.length > 0 
              ? `AI has context of ${transcript.length} captured segments`
              : "Start capturing the lesson to provide context to the AI"
            }
          </p>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-4 mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-center p-8">
                <div>
                  <p className="text-lg font-medium">Confused about something?</p>
                  <p className="text-sm mt-1">Ask a question and I'll explain based on the lesson context</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-3",
                        message.role === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content || (isTyping && message.role === 'assistant' ? '...' : '')}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && messages[messages.length - 1]?.role !== 'assistant' && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="flex gap-2 flex-shrink-0">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="What are you confused about?"
              disabled={isTyping}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </MainLayout>
  );
};

export default ActiveAssistant;
