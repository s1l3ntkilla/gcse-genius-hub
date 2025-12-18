import React, { useState } from 'react';
import { MainLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Brain, 
  Target, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  Sparkles,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  sampleFlashcards, 
  samplePracticeQuestions, 
  sampleProgress,
  getSubjectLabel,
  getSubjectColor
} from '@/data/sampleData';
import { Subject, Flashcard, PracticeQuestion } from '@/types';

const subjects: Subject[] = ['maths', 'chemistry', 'biology', 'computer-science', 'french', 'music'];

const RevisionHub: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('maths');
  const [mode, setMode] = useState<'flashcards' | 'practice'>('flashcards');
  
  const subjectFlashcards = sampleFlashcards.filter(f => f.subject === selectedSubject);
  const subjectQuestions = samplePracticeQuestions.filter(q => q.subject === selectedSubject);
  const subjectProgress = sampleProgress.find(p => p.subject === selectedSubject);

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
              Master your subjects with flashcards and practice questions
            </p>
          </div>
        </div>

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
              {/* Progress Overview */}
              <Card className="card-elevated mb-6">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <Target className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {subjectProgress?.topicsCompleted || 0}/{subjectProgress?.totalTopics || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Topics Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-2">
                        <Brain className="w-8 h-8 text-success" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {subjectProgress?.flashcardsReviewed || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Cards Reviewed</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-warning/10 flex items-center justify-center mb-2">
                        <CheckCircle className="w-8 h-8 text-warning" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {subjectProgress ? Math.round((subjectProgress.correctAnswers / subjectProgress.questionsAnswered) * 100) : 0}%
                      </p>
                      <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                        <Trophy className="w-8 h-8 text-destructive" />
                      </div>
                      <p className="text-2xl font-bold text-foreground">
                        {subjectProgress?.streakDays || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Day Streak</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {subjectProgress ? Math.round((subjectProgress.topicsCompleted / subjectProgress.totalTopics) * 100) : 0}%
                      </span>
                    </div>
                    <Progress 
                      value={subjectProgress ? (subjectProgress.topicsCompleted / subjectProgress.totalTopics) * 100 : 0} 
                      className="h-3"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Mode Toggle */}
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant={mode === 'flashcards' ? 'default' : 'outline'}
                  onClick={() => setMode('flashcards')}
                  className={cn(
                    "gap-2",
                    mode === 'flashcards' && "bg-primary hover:bg-primary-dark"
                  )}
                >
                  <Brain className="w-4 h-4" />
                  Flashcards ({subjectFlashcards.length})
                </Button>
                <Button 
                  variant={mode === 'practice' ? 'default' : 'outline'}
                  onClick={() => setMode('practice')}
                  className={cn(
                    "gap-2",
                    mode === 'practice' && "bg-primary hover:bg-primary-dark"
                  )}
                >
                  <Target className="w-4 h-4" />
                  Practice Questions ({subjectQuestions.length})
                </Button>
              </div>

              {/* Content */}
              {mode === 'flashcards' ? (
                <FlashcardViewer flashcards={subjectFlashcards} />
              ) : (
                <PracticeQuestionViewer questions={subjectQuestions} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Flashcard Viewer Component
const FlashcardViewer: React.FC<{ flashcards: Flashcard[] }> = ({ flashcards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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

  if (flashcards.length === 0) {
    return (
      <Card className="card-elevated">
        <CardContent className="py-12 text-center">
          <Brain className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No flashcards yet</h3>
          <p className="text-muted-foreground mt-1">
            Flashcards for this subject will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
          className="relative w-full max-w-2xl h-80 perspective-1000 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div 
            className={cn(
              "absolute inset-0 transition-transform duration-500 transform-style-3d",
              isFlipped && "rotate-y-180"
            )}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <Card 
              className={cn(
                "absolute inset-0 card-elevated flex flex-col items-center justify-center p-8 backface-hidden",
                isFlipped && "invisible"
              )}
            >
              <Badge variant="secondary" className="mb-4">
                {currentCard.topic}
              </Badge>
              <p className="text-xl text-center font-medium text-foreground">
                {currentCard.question}
              </p>
              <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Click to reveal answer
              </p>
              <Badge 
                variant="outline" 
                className={cn(
                  "absolute top-4 right-4",
                  currentCard.difficulty === 'easy' && "border-success text-success",
                  currentCard.difficulty === 'medium' && "border-warning text-warning",
                  currentCard.difficulty === 'hard' && "border-destructive text-destructive"
                )}
              >
                {currentCard.difficulty}
              </Badge>
            </Card>

            {/* Back */}
            <Card 
              className={cn(
                "absolute inset-0 card-elevated flex flex-col items-center justify-center p-8 bg-primary/5 border-primary/20",
                !isFlipped && "invisible"
              )}
              style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
            >
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                Answer
              </Badge>
              <p className="text-xl text-center font-medium text-foreground">
                {currentCard.answer}
              </p>
              <div className="flex items-center gap-3 mt-6">
                <Button variant="outline" size="sm" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Review Again
                </Button>
                <Button size="sm" className="gap-2 bg-success hover:bg-success/90 text-success-foreground">
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
    </div>
  );
};

// Practice Question Viewer Component
const PracticeQuestionViewer: React.FC<{ questions: PracticeQuestion[] }> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

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

  if (questions.length === 0) {
    return (
      <Card className="card-elevated">
        <CardContent className="py-12 text-center">
          <Target className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">No practice questions yet</h3>
          <p className="text-muted-foreground mt-1">
            Practice questions for this subject will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
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
              {currentQuestion.topic}
            </Badge>
            <Badge 
              variant="outline"
              className={cn(
                currentQuestion.difficulty === 'easy' && "border-success text-success",
                currentQuestion.difficulty === 'medium' && "border-warning text-warning",
                currentQuestion.difficulty === 'hard' && "border-destructive text-destructive"
              )}
            >
              {currentQuestion.marks} marks
            </Badge>
          </div>

          <h3 className="text-lg font-medium mb-6">{currentQuestion.question}</h3>

          <div className="space-y-3">
            {currentQuestion.options?.map((option, index) => {
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
              className="w-full mt-4 bg-primary hover:bg-primary-dark"
            >
              Next Question
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RevisionHub;
