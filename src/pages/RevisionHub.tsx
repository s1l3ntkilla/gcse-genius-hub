import React, { useState, useRef, useEffect } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  Brain, 
  Target, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  Sparkles,
  MessageSquare,
  Upload,
  Loader2,
  Send,
  FileText,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Subject } from '@/types';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  topic: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const subjects: Subject[] = ['maths', 'chemistry', 'biology', 'computer-science', 'french', 'music'];

const getSubjectLabel = (subject: Subject): string => {
  const labels: Record<Subject, string> = {
    maths: 'Mathematics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    'computer-science': 'Computer Science',
    french: 'French',
    music: 'Music',
  };
  return labels[subject];
};

const RevisionHub: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('maths');
  const [mode, setMode] = useState<'flashcards' | 'practice' | 'chat'>('flashcards');
  const [specificationContext, setSpecificationContext] = useState<string>('');
  const [specDialogOpen, setSpecDialogOpen] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              Revision Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered revision with flashcards, practice questions, and tutoring
            </p>
          </div>
          <Dialog open={specDialogOpen} onOpenChange={setSpecDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Import Specification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import GCSE Specification</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Paste your GCSE specification content below to give the AI context about your curriculum.
                </p>
                <Textarea 
                  placeholder="Paste specification content here (topics, key terms, learning objectives...)"
                  className="min-h-[200px]"
                  value={specificationContext}
                  onChange={(e) => setSpecificationContext(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSpecDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setSpecDialogOpen(false);
                    if (specificationContext) {
                      toast.success('Specification imported successfully');
                    }
                  }}>
                    Save Specification
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {specificationContext && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
            <FileText className="w-4 h-4" />
            <span>Specification loaded - AI will use this context</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-auto h-6 text-xs"
              onClick={() => setSpecificationContext('')}
            >
              Clear
            </Button>
          </div>
        )}

        {/* Subject Tabs */}
        <Tabs value={selectedSubject} onValueChange={(v) => setSelectedSubject(v as Subject)}>
          <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
            {subjects.map((subject) => (
              <TabsTrigger 
                key={subject}
                value={subject}
                className={cn(
                  "px-4 py-2 rounded-lg data-[state=active]:shadow-md transition-all",
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                )}
              >
                {getSubjectLabel(subject)}
              </TabsTrigger>
            ))}
          </TabsList>

          {subjects.map((subject) => (
            <TabsContent key={subject} value={subject} className="mt-6">
              {/* Mode Toggle */}
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant={mode === 'flashcards' ? 'default' : 'outline'}
                  onClick={() => setMode('flashcards')}
                  className="gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Flashcards
                </Button>
                <Button 
                  variant={mode === 'practice' ? 'default' : 'outline'}
                  onClick={() => setMode('practice')}
                  className="gap-2"
                >
                  <Target className="w-4 h-4" />
                  Practice Questions
                </Button>
                <Button 
                  variant={mode === 'chat' ? 'default' : 'outline'}
                  onClick={() => setMode('chat')}
                  className="gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  AI Tutor
                </Button>
              </div>

              {/* Content */}
              {mode === 'flashcards' ? (
                <FlashcardSection subject={subject} specificationContext={specificationContext} />
              ) : mode === 'practice' ? (
                <PracticeSection subject={subject} specificationContext={specificationContext} />
              ) : (
                <ChatSection subject={subject} specificationContext={specificationContext} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Flashcard Section with AI generation
const FlashcardSection: React.FC<{ subject: Subject; specificationContext: string }> = ({ subject, specificationContext }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState('5');

  const generateFlashcards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/revision-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-flashcards',
          subject: getSubjectLabel(subject),
          topic,
          specificationContext,
          count: parseInt(count),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate flashcards');
      }

      const result = await response.json();
      const newCards = result.data.map((card: any, idx: number) => ({
        ...card,
        id: `${Date.now()}-${idx}`,
      }));
      setFlashcards(newCards);
      setCurrentIndex(0);
      setIsFlipped(false);
      toast.success(`Generated ${newCards.length} flashcards!`);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate flashcards');
    } finally {
      setLoading(false);
    }
  };

  const currentCard = flashcards[currentIndex];

  const goNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const goPrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="topic">Topic (optional)</Label>
              <Input 
                id="topic"
                placeholder="e.g., Quadratic equations, Cell division..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="w-24">
              <Label htmlFor="count">Count</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger id="count">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateFlashcards} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Flashcards
            </Button>
          </div>
        </CardContent>
      </Card>

      {flashcards.length === 0 ? (
        <Card className="card-elevated">
          <CardContent className="py-12 text-center">
            <Brain className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No flashcards yet</h3>
            <p className="text-muted-foreground mt-1">
              Click "Generate Flashcards" to create AI-powered revision cards
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex(index);
                }}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  index === currentIndex 
                    ? "bg-primary w-6" 
                    : "bg-muted hover:bg-muted-foreground/30"
                )}
              />
            ))}
          </div>

          {/* Flashcard */}
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goPrev}
              className="w-12 h-12 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div 
              className="relative w-full max-w-2xl h-80 cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ perspective: '1000px' }}
            >
              <div 
                className="absolute inset-0 transition-transform duration-500"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front */}
                <Card 
                  className="absolute inset-0 card-elevated flex flex-col items-center justify-center p-8"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <Badge variant="secondary" className="mb-4">
                    {currentCard?.topic}
                  </Badge>
                  <p className="text-xl text-center font-medium text-foreground">
                    {currentCard?.question}
                  </p>
                  <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Click to reveal answer
                  </p>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "absolute top-4 right-4",
                      currentCard?.difficulty === 'easy' && "border-success text-success",
                      currentCard?.difficulty === 'medium' && "border-warning text-warning",
                      currentCard?.difficulty === 'hard' && "border-destructive text-destructive"
                    )}
                  >
                    {currentCard?.difficulty}
                  </Badge>
                </Card>

                {/* Back */}
                <Card 
                  className="absolute inset-0 card-elevated flex flex-col items-center justify-center p-8 bg-primary/5 border-primary/20"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                    Answer
                  </Badge>
                  <p className="text-xl text-center font-medium text-foreground">
                    {currentCard?.answer}
                  </p>
                  <div className="flex items-center gap-3 mt-6">
                    <Button variant="outline" size="sm" className="gap-2" onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}>
                      <RotateCcw className="w-4 h-4" />
                      Review Again
                    </Button>
                    <Button size="sm" className="gap-2 bg-success hover:bg-success/90 text-success-foreground" onClick={(e) => { e.stopPropagation(); goNext(); }}>
                      <CheckCircle className="w-4 h-4" />
                      Got It
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goNext}
              className="w-12 h-12 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Card Counter */}
          <p className="text-center text-muted-foreground">
            Card {currentIndex + 1} of {flashcards.length}
          </p>
        </>
      )}
    </div>
  );
};

// Practice Question Section with AI generation
const PracticeSection: React.FC<{ subject: Subject; specificationContext: string }> = ({ subject, specificationContext }) => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/revision-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-questions',
          subject: getSubjectLabel(subject),
          topic,
          specificationContext,
          count: 5,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate questions');
      }

      const result = await response.json();
      const newQuestions = result.data.map((q: any, idx: number) => ({
        ...q,
        id: `${Date.now()}-${idx}`,
      }));
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore({ correct: 0, total: 0 });
      toast.success(`Generated ${newQuestions.length} questions!`);
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentQuestion.correctAnswer) {
      setScore(prev => ({ correct: prev.correct + 1, total: prev.total + 1 }));
    } else {
      setScore(prev => ({ ...prev, total: prev.total + 1 }));
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <Card className="card-elevated">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="q-topic">Topic (optional)</Label>
              <Input 
                id="q-topic"
                placeholder="e.g., Photosynthesis, Electricity..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <Button onClick={generateQuestions} disabled={loading} className="gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Questions
            </Button>
          </div>
        </CardContent>
      </Card>

      {questions.length === 0 ? (
        <Card className="card-elevated">
          <CardContent className="py-12 text-center">
            <Target className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No practice questions yet</h3>
            <p className="text-muted-foreground mt-1">
              Click "Generate Questions" to create AI-powered practice questions
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Score */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-sm">
              Question {currentIndex + 1} of {questions.length}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Score: {score.correct}/{score.total}
            </Badge>
          </div>

          {/* Question Card */}
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <Badge variant="outline" className="text-xs">
                  {currentQuestion?.topic}
                </Badge>
                <Badge 
                  variant="outline"
                  className={cn(
                    currentQuestion?.difficulty === 'easy' && "border-success text-success",
                    currentQuestion?.difficulty === 'medium' && "border-warning text-warning",
                    currentQuestion?.difficulty === 'hard' && "border-destructive text-destructive"
                  )}
                >
                  {currentQuestion?.marks} marks
                </Badge>
              </div>

              <h3 className="text-lg font-medium mb-6">{currentQuestion?.question}</h3>

              <div className="space-y-3">
                {currentQuestion?.options?.map((option, index) => {
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const isSelected = option === selectedAnswer;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                      className={cn(
                        "w-full p-4 rounded-xl border text-left transition-all",
                        !showResult && "hover:border-primary/50 hover:bg-primary/5",
                        showResult && isCorrect && "border-success bg-success/10",
                        showResult && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                        !showResult && "border-border"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResult && isCorrect && (
                          <CheckCircle className="w-5 h-5 text-success" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className={cn(
                  "mt-6 p-4 rounded-xl",
                  selectedAnswer === currentQuestion.correctAnswer 
                    ? "bg-success/10 border border-success/20" 
                    : "bg-destructive/10 border border-destructive/20"
                )}>
                  <p className="font-medium mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Not quite right'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Explanation:</strong> {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {showResult && (
                <Button 
                  onClick={nextQuestion} 
                  className="w-full mt-4"
                >
                  Next Question
                </Button>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

// AI Chat Section
const ChatSection: React.FC<{ subject: Subject; specificationContext: string }> = ({ subject, specificationContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let assistantContent = '';

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/revision-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          subject: getSubjectLabel(subject),
          specificationContext,
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantContent } : m);
                }
                return [...prev, { role: 'assistant', content: assistantContent }];
              });
            }
          } catch {
            // Incomplete JSON, wait for more data
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
      setMessages(prev => prev.filter(m => m !== userMessage));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="card-elevated">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5 text-primary" />
          AI Tutor - {getSubjectLabel(subject)}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ask me anything about {getSubjectLabel(subject)}!</p>
              <p className="text-sm mt-2">I'll explain concepts, help with problems, and guide your revision.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex",
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2",
                  msg.role === 'user' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-4">
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevisionHub;
