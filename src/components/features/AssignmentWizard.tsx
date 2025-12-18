import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  GraduationCap,
  Target,
  Hash,
  BarChart3,
  Sparkles,
  FileCheck,
  Send,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AssignmentWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ExamBoard = 'AQA' | 'Edexcel' | 'OCR';
type Subject = 'Chemistry' | 'Biology' | 'Maths';

interface Topic {
  id: string;
  name: string;
  subtopics: { id: string; name: string }[];
}

const TOPICS_BY_BOARD: Record<ExamBoard, Record<Subject, Topic[]>> = {
  AQA: {
    Chemistry: [
      { id: 'c1', name: 'Atomic Structure', subtopics: [
        { id: 'c1-1', name: 'Atoms, elements and compounds' },
        { id: 'c1-2', name: 'Mixtures' },
        { id: 'c1-3', name: 'Atomic structure' }
      ]},
      { id: 'c2', name: 'Bonding & Structure', subtopics: [
        { id: 'c2-1', name: 'Ionic bonding' },
        { id: 'c2-2', name: 'Covalent bonding' },
        { id: 'c2-3', name: 'Metallic bonding' }
      ]},
      { id: 'c3', name: 'Quantitative Chemistry', subtopics: [
        { id: 'c3-1', name: 'Conservation of mass' },
        { id: 'c3-2', name: 'Moles' },
        { id: 'c3-3', name: 'Limiting reactants' }
      ]},
      { id: 'c4', name: 'Chemical Changes', subtopics: [
        { id: 'c4-1', name: 'Reactivity of metals' },
        { id: 'c4-2', name: 'Extraction of metals' },
        { id: 'c4-3', name: 'Acids and alkalis' }
      ]},
    ],
    Biology: [
      { id: 'b1', name: 'Cell Biology', subtopics: [
        { id: 'b1-1', name: 'Cell structure' },
        { id: 'b1-2', name: 'Cell division' },
        { id: 'b1-3', name: 'Transport in cells' }
      ]},
      { id: 'b2', name: 'Organisation', subtopics: [
        { id: 'b2-1', name: 'Principles of organisation' },
        { id: 'b2-2', name: 'The human digestive system' },
        { id: 'b2-3', name: 'Blood and blood vessels' }
      ]},
      { id: 'b3', name: 'Infection & Response', subtopics: [
        { id: 'b3-1', name: 'Communicable diseases' },
        { id: 'b3-2', name: 'Human defence systems' },
        { id: 'b3-3', name: 'Vaccination' }
      ]},
    ],
    Maths: [
      { id: 'm1', name: 'Number', subtopics: [
        { id: 'm1-1', name: 'Fractions, decimals and percentages' },
        { id: 'm1-2', name: 'Indices and surds' },
        { id: 'm1-3', name: 'Standard form' }
      ]},
      { id: 'm2', name: 'Algebra', subtopics: [
        { id: 'm2-1', name: 'Expressions and equations' },
        { id: 'm2-2', name: 'Quadratics' },
        { id: 'm2-3', name: 'Simultaneous equations' }
      ]},
      { id: 'm3', name: 'Geometry', subtopics: [
        { id: 'm3-1', name: 'Angles and polygons' },
        { id: 'm3-2', name: 'Circles' },
        { id: 'm3-3', name: 'Transformations' }
      ]},
    ],
  },
  Edexcel: {
    Chemistry: [
      { id: 'c1', name: 'Key Concepts', subtopics: [
        { id: 'c1-1', name: 'Atomic structure' },
        { id: 'c1-2', name: 'The periodic table' },
        { id: 'c1-3', name: 'Ionic bonding' }
      ]},
      { id: 'c2', name: 'States of Matter', subtopics: [
        { id: 'c2-1', name: 'States of matter' },
        { id: 'c2-2', name: 'Methods of separating mixtures' }
      ]},
    ],
    Biology: [
      { id: 'b1', name: 'Key Concepts', subtopics: [
        { id: 'b1-1', name: 'Cells and microscopy' },
        { id: 'b1-2', name: 'DNA and protein synthesis' }
      ]},
      { id: 'b2', name: 'Cells and Control', subtopics: [
        { id: 'b2-1', name: 'Mitosis and cell cycle' },
        { id: 'b2-2', name: 'Stem cells' }
      ]},
    ],
    Maths: [
      { id: 'm1', name: 'Number', subtopics: [
        { id: 'm1-1', name: 'Calculations' },
        { id: 'm1-2', name: 'Fractions and percentages' }
      ]},
      { id: 'm2', name: 'Algebra', subtopics: [
        { id: 'm2-1', name: 'Solving equations' },
        { id: 'm2-2', name: 'Sequences' }
      ]},
    ],
  },
  OCR: {
    Chemistry: [
      { id: 'c1', name: 'Particles', subtopics: [
        { id: 'c1-1', name: 'Atomic structure' },
        { id: 'c1-2', name: 'Elements and compounds' }
      ]},
      { id: 'c2', name: 'Elements and Compounds', subtopics: [
        { id: 'c2-1', name: 'The periodic table' },
        { id: 'c2-2', name: 'Types of bonding' }
      ]},
    ],
    Biology: [
      { id: 'b1', name: 'Cell Level Systems', subtopics: [
        { id: 'b1-1', name: 'Cell structures' },
        { id: 'b1-2', name: 'What happens in cells' }
      ]},
      { id: 'b2', name: 'Scaling Up', subtopics: [
        { id: 'b2-1', name: 'Supplying cells' },
        { id: 'b2-2', name: 'The challenges of size' }
      ]},
    ],
    Maths: [
      { id: 'm1', name: 'Number Operations', subtopics: [
        { id: 'm1-1', name: 'Basic operations' },
        { id: 'm1-2', name: 'Decimals and fractions' }
      ]},
      { id: 'm2', name: 'Algebra Foundations', subtopics: [
        { id: 'm2-1', name: 'Expressions' },
        { id: 'm2-2', name: 'Linear equations' }
      ]},
    ],
  },
};

const STEPS = [
  { id: 1, title: 'Exam Board', icon: BookOpen },
  { id: 2, title: 'Subject', icon: GraduationCap },
  { id: 3, title: 'Topics', icon: Target },
  { id: 4, title: 'Quantity', icon: Hash },
  { id: 5, title: 'Difficulty', icon: BarChart3 },
  { id: 6, title: 'Generate', icon: Sparkles },
  { id: 7, title: 'Review', icon: FileCheck },
  { id: 8, title: 'Publish', icon: Send },
];

interface GeneratedQuestion {
  id: string;
  question: string;
  marks: number;
  commandWord: string;
  subtopic: string;
  difficulty: string;
  markScheme: string;
}

const AssignmentWizard: React.FC<AssignmentWizardProps> = ({ open, onOpenChange }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [examBoard, setExamBoard] = useState<ExamBoard | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [interleaveTopics, setInterleaveTopics] = useState(false);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [totalMarks, setTotalMarks] = useState(20);
  const [difficultyDistribution, setDifficultyDistribution] = useState<Record<string, { grade: string; count: number }>>({});
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [assignmentName, setAssignmentName] = useState('');
  const [className, setClassName] = useState('');

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < 8) {
      if (currentStep === 5) {
        generateQuestions();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubtopicToggle = (subtopicId: string) => {
    setSelectedSubtopics(prev => 
      prev.includes(subtopicId) 
        ? prev.filter(id => id !== subtopicId)
        : [...prev, subtopicId]
    );
  };

  const initializeDifficultyDistribution = () => {
    const distribution: Record<string, { grade: string; count: number }> = {};
    const questionsPerSubtopic = Math.ceil(questionCount / selectedSubtopics.length);
    
    selectedSubtopics.forEach((subtopicId, index) => {
      const subtopicName = getSubtopicName(subtopicId);
      distribution[subtopicId] = {
        grade: index % 2 === 0 ? '7-9' : '4-6',
        count: Math.min(questionsPerSubtopic, questionCount - Object.values(distribution).reduce((sum, d) => sum + d.count, 0))
      };
    });
    
    setDifficultyDistribution(distribution);
  };

  const getSubtopicName = (subtopicId: string): string => {
    if (!examBoard || !subject) return subtopicId;
    const topics = TOPICS_BY_BOARD[examBoard][subject];
    for (const topic of topics) {
      const subtopic = topic.subtopics.find(s => s.id === subtopicId);
      if (subtopic) return subtopic.name;
    }
    return subtopicId;
  };

  const generateQuestions = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation with realistic questions based on command words
    const commandWords = ['State', 'Describe', 'Explain', 'Evaluate', 'Compare', 'Calculate'];
    const questions: GeneratedQuestion[] = [];
    
    let remainingMarks = totalMarks;
    let questionIndex = 0;

    for (const [subtopicId, config] of Object.entries(difficultyDistribution)) {
      const subtopicName = getSubtopicName(subtopicId);
      
      for (let i = 0; i < config.count && questionIndex < questionCount; i++) {
        const commandWord = commandWords[Math.floor(Math.random() * commandWords.length)];
        let marks = 2;
        
        // Assign marks based on command word
        switch (commandWord) {
          case 'State': marks = 1; break;
          case 'Describe': marks = 2; break;
          case 'Explain': marks = 3; break;
          case 'Calculate': marks = 4; break;
          case 'Compare': marks = 4; break;
          case 'Evaluate': marks = 6; break;
        }
        
        marks = Math.min(marks, remainingMarks);
        remainingMarks -= marks;

        questions.push({
          id: `q-${questionIndex}`,
          question: `${commandWord} ${generateQuestionText(subtopicName, commandWord)}`,
          marks,
          commandWord,
          subtopic: subtopicName,
          difficulty: config.grade,
          markScheme: generateMarkScheme(commandWord, marks),
        });
        
        questionIndex++;
      }
    }
    
    // Simulate delay for generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setGeneratedQuestions(questions);
    setIsGenerating(false);
  };

  const generateQuestionText = (subtopic: string, commandWord: string): string => {
    const templates: Record<string, string[]> = {
      'State': [
        `the definition of ${subtopic}.`,
        `one example of ${subtopic}.`,
        `the key feature of ${subtopic}.`,
      ],
      'Describe': [
        `the process of ${subtopic}.`,
        `how ${subtopic} works.`,
        `the main characteristics of ${subtopic}.`,
      ],
      'Explain': [
        `why ${subtopic} is important.`,
        `how ${subtopic} affects the outcome.`,
        `the relationship between ${subtopic} and its effects.`,
      ],
      'Evaluate': [
        `the advantages and disadvantages of ${subtopic}.`,
        `the effectiveness of ${subtopic} in practice.`,
        `the impact of ${subtopic} on modern applications.`,
      ],
      'Compare': [
        `the similarities and differences in ${subtopic}.`,
        `two methods of ${subtopic}.`,
        `the approaches used in ${subtopic}.`,
      ],
      'Calculate': [
        `the value using the ${subtopic} method.`,
        `the result based on ${subtopic} principles.`,
        `the answer using ${subtopic} formulas.`,
      ],
    };
    
    const options = templates[commandWord] || [`about ${subtopic}.`];
    return options[Math.floor(Math.random() * options.length)];
  };

  const generateMarkScheme = (commandWord: string, marks: number): string => {
    const points = [];
    for (let i = 1; i <= marks; i++) {
      points.push(`• Award ${i} mark for ${commandWord === 'Calculate' ? 'correct working/answer' : 'valid point with explanation'}`);
    }
    return points.join('\n');
  };

  const handlePublish = () => {
    toast.success(
      `🌟 Success! Assignment "${assignmentName}" has been published to ${className}. It is now visible on the student platform.`,
      { duration: 5000 }
    );
    onOpenChange(false);
    resetWizard();
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setExamBoard(null);
    setSubject(null);
    setSelectedTopic(null);
    setInterleaveTopics(false);
    setSelectedSubtopics([]);
    setQuestionCount(5);
    setTotalMarks(20);
    setDifficultyDistribution({});
    setGeneratedQuestions([]);
    setAssignmentName('');
    setClassName('');
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return !!examBoard;
      case 2: return !!subject;
      case 3: return selectedSubtopics.length > 0;
      case 4: return questionCount > 0 && totalMarks > 0;
      case 5: return Object.keys(difficultyDistribution).length > 0;
      case 6: return generatedQuestions.length > 0;
      case 7: return !!assignmentName && !!className;
      default: return true;
    }
  };

  const renderDifficultyDiagram = () => {
    const maxCount = Math.max(...Object.values(difficultyDistribution).map(d => d.count), 1);
    
    return (
      <div className="space-y-3 font-mono text-sm">
        {Object.entries(difficultyDistribution).map(([subtopicId, config]) => {
          const subtopicName = getSubtopicName(subtopicId);
          const barLength = Math.round((config.count / maxCount) * 20);
          const bar = '█'.repeat(barLength) + '░'.repeat(20 - barLength);
          
          return (
            <div key={subtopicId} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground truncate max-w-[200px]">{subtopicName}</span>
                <Badge variant="outline" className="text-xs">Grade {config.grade}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">{bar}</span>
                <span className="text-muted-foreground">({config.count} Qs)</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">Which exam board are you creating this assignment for?</p>
            <RadioGroup value={examBoard || ''} onValueChange={(v) => setExamBoard(v as ExamBoard)}>
              {(['AQA', 'Edexcel', 'OCR'] as ExamBoard[]).map((board) => (
                <div key={board} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                  <RadioGroupItem value={board} id={board} />
                  <Label htmlFor={board} className="flex-1 cursor-pointer font-medium">{board}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">Select the subject for this assignment:</p>
            <RadioGroup value={subject || ''} onValueChange={(v) => setSubject(v as Subject)}>
              {(['Chemistry', 'Biology', 'Maths'] as Subject[]).map((subj) => (
                <div key={subj} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                  <RadioGroupItem value={subj} id={subj} />
                  <Label htmlFor={subj} className="flex-1 cursor-pointer font-medium">GCSE {subj}</Label>
                </div>
              ))}
            </RadioGroup>
            {examBoard && subject && (
              <p className="text-sm text-success flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Found {examBoard} GCSE {subject} specification!
              </p>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">Select a main topic and subtopics:</p>
            
            {examBoard && subject && (
              <>
                <div className="space-y-2">
                  <Label>Main Topic</Label>
                  <RadioGroup value={selectedTopic?.id || ''} onValueChange={(v) => {
                    const topic = TOPICS_BY_BOARD[examBoard][subject].find(t => t.id === v);
                    setSelectedTopic(topic || null);
                    setSelectedSubtopics([]);
                  }}>
                    {TOPICS_BY_BOARD[examBoard][subject].map((topic) => (
                      <div key={topic.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                        <RadioGroupItem value={topic.id} id={topic.id} />
                        <Label htmlFor={topic.id} className="flex-1 cursor-pointer">{topic.name}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {selectedTopic && (
                  <>
                    <div className="flex items-center space-x-2 p-3 bg-accent/30 rounded-lg">
                      <Checkbox 
                        id="interleave" 
                        checked={interleaveTopics}
                        onCheckedChange={(checked) => setInterleaveTopics(!!checked)}
                      />
                      <Label htmlFor="interleave" className="text-sm cursor-pointer">
                        Include questions from other topics (interleaving)
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Select Subtopics</Label>
                      <div className="space-y-2">
                        {selectedTopic.subtopics.map((subtopic) => (
                          <div key={subtopic.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 cursor-pointer transition-colors">
                            <Checkbox 
                              id={subtopic.id}
                              checked={selectedSubtopics.includes(subtopic.id)}
                              onCheckedChange={() => handleSubtopicToggle(subtopic.id)}
                            />
                            <Label htmlFor={subtopic.id} className="flex-1 cursor-pointer">{subtopic.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">How many questions and marks would you like?</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Number of Questions: {questionCount}</Label>
                <Slider
                  value={[questionCount]}
                  onValueChange={([v]) => setQuestionCount(v)}
                  min={1}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Total Marks: {totalMarks}</Label>
                <Slider
                  value={[totalMarks]}
                  onValueChange={([v]) => setTotalMarks(v)}
                  min={5}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <Card className="bg-accent/30">
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Average marks per question: <span className="font-bold text-foreground">{(totalMarks / questionCount).toFixed(1)}</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 5:
        if (Object.keys(difficultyDistribution).length === 0) {
          initializeDifficultyDistribution();
        }
        
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">📊 Review and adjust the difficulty distribution:</p>
            
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                {renderDifficultyDiagram()}
              </CardContent>
            </Card>

            <div className="space-y-4">
              {Object.entries(difficultyDistribution).map(([subtopicId, config]) => (
                <div key={subtopicId} className="space-y-2 p-3 border border-border rounded-lg">
                  <Label className="text-sm">{getSubtopicName(subtopicId)}</Label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Grade Target</Label>
                      <RadioGroup 
                        value={config.grade} 
                        onValueChange={(v) => setDifficultyDistribution(prev => ({
                          ...prev,
                          [subtopicId]: { ...prev[subtopicId], grade: v }
                        }))}
                        className="flex gap-2 mt-1"
                      >
                        {['1-3', '4-6', '7-9'].map((grade) => (
                          <div key={grade} className="flex items-center space-x-1">
                            <RadioGroupItem value={grade} id={`${subtopicId}-${grade}`} />
                            <Label htmlFor={`${subtopicId}-${grade}`} className="text-xs cursor-pointer">{grade}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="w-24">
                      <Label className="text-xs text-muted-foreground">Questions</Label>
                      <Input 
                        type="number"
                        min={1}
                        max={10}
                        value={config.count}
                        onChange={(e) => setDifficultyDistribution(prev => ({
                          ...prev,
                          [subtopicId]: { ...prev[subtopicId], count: parseInt(e.target.value) || 1 }
                        }))}
                        className="mt-1 h-8"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">Generating your questions using command word guidelines...</p>
            
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
                <p className="text-muted-foreground">Creating questions with appropriate command words...</p>
              </div>
            ) : (
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {generatedQuestions.map((q, index) => (
                    <Card key={q.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{q.commandWord}</Badge>
                              <Badge variant="secondary">{q.marks} mark{q.marks > 1 ? 's' : ''}</Badge>
                              <Badge className="bg-primary/10 text-primary">Grade {q.difficulty}</Badge>
                            </div>
                            <p className="font-medium">Q{index + 1}. {q.question}</p>
                            <p className="text-xs text-muted-foreground mt-1">Topic: {q.subtopic}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
            
            {!isGenerating && generatedQuestions.length > 0 && (
              <p className="text-sm text-success flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Generated {generatedQuestions.length} questions totaling {generatedQuestions.reduce((sum, q) => sum + q.marks, 0)} marks
              </p>
            )}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">📋 Review and add assignment details:</p>
            
            <ScrollArea className="h-[200px] border border-border rounded-lg p-4">
              <div className="space-y-4">
                {generatedQuestions.map((q, index) => (
                  <div key={q.id} className="pb-4 border-b border-border last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold">Q{index + 1}.</span>
                      <Badge variant="outline" className="text-xs">{q.marks} marks</Badge>
                    </div>
                    <p className="text-sm mb-2">{q.question}</p>
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      <p className="font-medium mb-1">Mark Scheme:</p>
                      <pre className="whitespace-pre-wrap">{q.markScheme}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assignmentName">Assignment Name</Label>
                <Input 
                  id="assignmentName"
                  placeholder="e.g., Chemistry Unit 2 Assessment"
                  value={assignmentName}
                  onChange={(e) => setAssignmentName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="className">Class Name / ID</Label>
                <Input 
                  id="className"
                  placeholder="e.g., 10A Science"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
              <Send className="w-10 h-10 text-success" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to Publish!</h3>
              <p className="text-muted-foreground">
                Assignment: <span className="font-medium text-foreground">{assignmentName}</span>
              </p>
              <p className="text-muted-foreground">
                Class: <span className="font-medium text-foreground">{className}</span>
              </p>
              <p className="text-muted-foreground">
                Questions: <span className="font-medium text-foreground">{generatedQuestions.length}</span> | 
                Total Marks: <span className="font-medium text-foreground">{generatedQuestions.reduce((sum, q) => sum + q.marks, 0)}</span>
              </p>
            </div>
            <Button onClick={handlePublish} className="gap-2 bg-success hover:bg-success/90">
              <Send className="w-4 h-4" />
              Publish Assignment
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Assignment Wizard
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="space-y-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between overflow-x-auto pb-2">
            {STEPS.map((step) => {
              const StepIcon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div 
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center gap-1 min-w-[60px]",
                    isActive && "text-primary",
                    isCompleted && "text-success",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                    isActive && "border-primary bg-primary/10",
                    isCompleted && "border-success bg-success/10",
                    !isActive && !isCompleted && "border-muted"
                  )}>
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <ScrollArea className="flex-1 pr-4">
          <div className="py-4">
            {renderStepContent()}
          </div>
        </ScrollArea>

        {/* Navigation */}
        {currentStep < 8 && (
          <div className="flex justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed() || (currentStep === 6 && isGenerating)}
              className="gap-2"
            >
              {currentStep === 5 ? 'Generate' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentWizard;
