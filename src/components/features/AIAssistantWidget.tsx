import React, { useState } from 'react';
import { Bot, X, Send, Maximize2, Minimize2, Sparkles, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const mockResponses: Record<string, string> = {
  'default': "I'm your AI Learning Assistant! I can help you understand concepts, explain topics step-by-step, and answer questions about your subjects. What would you like to learn about?",
  'quadratic': "Great question! The quadratic formula x = (-b ± √(b² - 4ac)) / 2a is used to solve equations of the form ax² + bx + c = 0.\n\n**Step 1:** Identify a, b, and c from your equation\n**Step 2:** Calculate the discriminant (b² - 4ac)\n**Step 3:** If discriminant ≥ 0, plug values into the formula\n\nWould you like me to walk through an example?",
  'mitochondria': "The mitochondria is often called the 'powerhouse of the cell' because it produces ATP (adenosine triphosphate) - the energy currency that powers all cellular activities.\n\n**Key Points:**\n- Has a double membrane structure\n- Contains its own DNA\n- Performs cellular respiration\n- More mitochondria in cells that need more energy (like muscle cells)\n\nShall I explain the process of cellular respiration?",
  'python': "Python loops are fundamental for repeating actions!\n\n**For Loop** - when you know how many times to repeat:\n```python\nfor i in range(5):\n    print(i)  # Prints 0, 1, 2, 3, 4\n```\n\n**While Loop** - when you repeat until a condition is false:\n```python\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n```\n\nWant me to explain more complex loop patterns?",
};

export const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: mockResponses['default'],
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [difficulty, setDifficulty] = useState([50]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = mockResponses['default'];
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('quadratic') || lowerInput.includes('formula')) {
        response = mockResponses['quadratic'];
      } else if (lowerInput.includes('mitochondria') || lowerInput.includes('cell')) {
        response = mockResponses['mitochondria'];
      } else if (lowerInput.includes('python') || lowerInput.includes('loop')) {
        response = mockResponses['python'];
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg btn-glow bg-primary hover:bg-primary-dark z-50 animate-bounce-soft"
      >
        <Bot className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-50 bg-card rounded-2xl shadow-2xl border border-border flex flex-col transition-all duration-300",
        isExpanded 
          ? "bottom-4 right-4 left-4 top-4 md:left-auto md:w-[600px] md:h-[80vh]" 
          : "bottom-6 right-6 w-96 h-[500px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Here to help you learn</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Difficulty Slider */}
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Explanation Level</span>
          <span className="text-xs text-primary">
            {difficulty[0] < 33 ? 'Simple' : difficulty[0] < 66 ? 'Standard' : 'Advanced'}
          </span>
        </div>
        <Slider
          value={difficulty}
          onValueChange={setDifficulty}
          max={100}
          step={1}
          className="w-full"
        />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
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
                  "max-w-[85%] rounded-2xl px-4 py-3 animate-scale-in",
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-100" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Volume2 className="w-4 h-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1"
          />
          <Button 
            onClick={handleSend} 
            size="icon"
            disabled={!input.trim()}
            className="shrink-0 bg-primary hover:bg-primary-dark"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
