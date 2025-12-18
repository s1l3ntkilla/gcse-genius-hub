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
type Subject = 'Chemistry' | 'Biology' | 'Physics' | 'Maths';

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
      { id: 'c5', name: 'Energy Changes', subtopics: [
        { id: 'c5-1', name: 'Exothermic and endothermic reactions' },
        { id: 'c5-2', name: 'Reaction profiles' },
        { id: 'c5-3', name: 'Bond energies' }
      ]},
      { id: 'c6', name: 'Rates & Equilibrium', subtopics: [
        { id: 'c6-1', name: 'Rate of reaction' },
        { id: 'c6-2', name: 'Collision theory' },
        { id: 'c6-3', name: 'Reversible reactions' }
      ]},
      { id: 'c7', name: 'Organic Chemistry', subtopics: [
        { id: 'c7-1', name: 'Crude oil and fuels' },
        { id: 'c7-2', name: 'Alkanes and alkenes' },
        { id: 'c7-3', name: 'Alcohols and carboxylic acids' }
      ]},
      { id: 'c8', name: 'Chemical Analysis', subtopics: [
        { id: 'c8-1', name: 'Purity and formulations' },
        { id: 'c8-2', name: 'Chromatography' },
        { id: 'c8-3', name: 'Test for gases and ions' }
      ]},
      { id: 'c9', name: 'Chemistry of the Atmosphere', subtopics: [
        { id: 'c9-1', name: 'Evolution of the atmosphere' },
        { id: 'c9-2', name: 'Greenhouse gases' },
        { id: 'c9-3', name: 'Carbon footprint' }
      ]},
      { id: 'c10', name: 'Using Resources', subtopics: [
        { id: 'c10-1', name: 'Earth\'s resources' },
        { id: 'c10-2', name: 'Potable water' },
        { id: 'c10-3', name: 'Life cycle assessment' }
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
      { id: 'b4', name: 'Bioenergetics', subtopics: [
        { id: 'b4-1', name: 'Photosynthesis' },
        { id: 'b4-2', name: 'Respiration' },
        { id: 'b4-3', name: 'Metabolism' }
      ]},
      { id: 'b5', name: 'Homeostasis & Response', subtopics: [
        { id: 'b5-1', name: 'Nervous system' },
        { id: 'b5-2', name: 'Endocrine system' },
        { id: 'b5-3', name: 'Blood glucose control' }
      ]},
      { id: 'b6', name: 'Inheritance & Evolution', subtopics: [
        { id: 'b6-1', name: 'Reproduction' },
        { id: 'b6-2', name: 'Variation and evolution' },
        { id: 'b6-3', name: 'Genetics and inheritance' }
      ]},
      { id: 'b7', name: 'Ecology', subtopics: [
        { id: 'b7-1', name: 'Adaptations and communities' },
        { id: 'b7-2', name: 'Organisation of ecosystems' },
        { id: 'b7-3', name: 'Biodiversity' }
      ]},
    ],
    Physics: [
      { id: 'p1', name: 'Energy', subtopics: [
        { id: 'p1-1', name: 'Energy stores and transfers' },
        { id: 'p1-2', name: 'Conservation of energy' },
        { id: 'p1-3', name: 'Energy resources' }
      ]},
      { id: 'p2', name: 'Electricity', subtopics: [
        { id: 'p2-1', name: 'Current and circuits' },
        { id: 'p2-2', name: 'Series and parallel' },
        { id: 'p2-3', name: 'Domestic electricity' }
      ]},
      { id: 'p3', name: 'Particle Model', subtopics: [
        { id: 'p3-1', name: 'Density' },
        { id: 'p3-2', name: 'States of matter' },
        { id: 'p3-3', name: 'Specific heat capacity' }
      ]},
      { id: 'p4', name: 'Atomic Structure', subtopics: [
        { id: 'p4-1', name: 'Atomic structure' },
        { id: 'p4-2', name: 'Radioactive decay' },
        { id: 'p4-3', name: 'Nuclear radiation' }
      ]},
      { id: 'p5', name: 'Forces', subtopics: [
        { id: 'p5-1', name: 'Forces and motion' },
        { id: 'p5-2', name: 'Newton\'s laws' },
        { id: 'p5-3', name: 'Momentum' }
      ]},
      { id: 'p6', name: 'Waves', subtopics: [
        { id: 'p6-1', name: 'Wave properties' },
        { id: 'p6-2', name: 'Electromagnetic spectrum' },
        { id: 'p6-3', name: 'Light and sound' }
      ]},
      { id: 'p7', name: 'Magnetism', subtopics: [
        { id: 'p7-1', name: 'Permanent and induced magnets' },
        { id: 'p7-2', name: 'Electromagnets' },
        { id: 'p7-3', name: 'Motor effect' }
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
        { id: 'c1-3', name: 'Ionic bonding' },
        { id: 'c1-4', name: 'Covalent bonding' }
      ]},
      { id: 'c2', name: 'States of Matter', subtopics: [
        { id: 'c2-1', name: 'States of matter' },
        { id: 'c2-2', name: 'Methods of separating mixtures' },
        { id: 'c2-3', name: 'Acids and bases' }
      ]},
      { id: 'c3', name: 'Chemical Changes', subtopics: [
        { id: 'c3-1', name: 'Reactivity series' },
        { id: 'c3-2', name: 'Electrolysis' },
        { id: 'c3-3', name: 'Energy changes' }
      ]},
      { id: 'c4', name: 'Extracting & Using', subtopics: [
        { id: 'c4-1', name: 'Extracting metals' },
        { id: 'c4-2', name: 'Life cycle assessments' },
        { id: 'c4-3', name: 'Recycling' }
      ]},
      { id: 'c5', name: 'Separate Chemistry', subtopics: [
        { id: 'c5-1', name: 'Transition metals' },
        { id: 'c5-2', name: 'Quantitative analysis' },
        { id: 'c5-3', name: 'Chemical cells' }
      ]},
    ],
    Biology: [
      { id: 'b1', name: 'Key Concepts', subtopics: [
        { id: 'b1-1', name: 'Cells and microscopy' },
        { id: 'b1-2', name: 'DNA and protein synthesis' },
        { id: 'b1-3', name: 'Enzyme action' }
      ]},
      { id: 'b2', name: 'Cells and Control', subtopics: [
        { id: 'b2-1', name: 'Mitosis and cell cycle' },
        { id: 'b2-2', name: 'Stem cells' },
        { id: 'b2-3', name: 'Nervous system' }
      ]},
      { id: 'b3', name: 'Genetics', subtopics: [
        { id: 'b3-1', name: 'Meiosis' },
        { id: 'b3-2', name: 'DNA structure' },
        { id: 'b3-3', name: 'Protein synthesis' }
      ]},
      { id: 'b4', name: 'Natural Selection', subtopics: [
        { id: 'b4-1', name: 'Evidence for evolution' },
        { id: 'b4-2', name: 'Darwin\'s theory' },
        { id: 'b4-3', name: 'Selective breeding' }
      ]},
      { id: 'b5', name: 'Health & Disease', subtopics: [
        { id: 'b5-1', name: 'Health and disease' },
        { id: 'b5-2', name: 'Pathogens' },
        { id: 'b5-3', name: 'Human defence' }
      ]},
    ],
    Physics: [
      { id: 'p1', name: 'Key Concepts', subtopics: [
        { id: 'p1-1', name: 'Motion' },
        { id: 'p1-2', name: 'Forces' },
        { id: 'p1-3', name: 'Conservation of energy' }
      ]},
      { id: 'p2', name: 'Motion & Forces', subtopics: [
        { id: 'p2-1', name: 'Newton\'s laws' },
        { id: 'p2-2', name: 'Momentum' },
        { id: 'p2-3', name: 'Stopping distances' }
      ]},
      { id: 'p3', name: 'Conservation of Energy', subtopics: [
        { id: 'p3-1', name: 'Energy stores' },
        { id: 'p3-2', name: 'Energy transfers' },
        { id: 'p3-3', name: 'Power and efficiency' }
      ]},
      { id: 'p4', name: 'Waves', subtopics: [
        { id: 'p4-1', name: 'Wave properties' },
        { id: 'p4-2', name: 'EM spectrum' },
        { id: 'p4-3', name: 'Wave applications' }
      ]},
      { id: 'p5', name: 'Electricity', subtopics: [
        { id: 'p5-1', name: 'Static electricity' },
        { id: 'p5-2', name: 'Current and circuits' },
        { id: 'p5-3', name: 'Power and energy' }
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
      { id: 'c1', name: 'C1: Particles', subtopics: [
        { id: 'c1.1', name: 'The particle model' },
        { id: 'c1.2', name: 'Atomic structure' }
      ]},
      { id: 'c2', name: 'C2: Elements, compounds and mixtures', subtopics: [
        { id: 'c2.1', name: 'Purity and separating mixtures' },
        { id: 'c2.2', name: 'Bonding' },
        { id: 'c2.3', name: 'Properties of materials' }
      ]},
      { id: 'c3', name: 'C3: Chemical reactions', subtopics: [
        { id: 'c3.1', name: 'Introducing chemical reactions' },
        { id: 'c3.2', name: 'Energetics' },
        { id: 'c3.3', name: 'Types of chemical reactions' },
        { id: 'c3.4', name: 'Electrolysis' }
      ]},
      { id: 'c4', name: 'C4: Predicting and identifying reactions', subtopics: [
        { id: 'c4.1', name: 'Predicting chemical reactions' }
      ]},
      { id: 'c5', name: 'C5: Monitoring and controlling reactions', subtopics: [
        { id: 'c5.1', name: 'Controlling reactions' },
        { id: 'c5.2', name: 'Equilibria' }
      ]},
      { id: 'c6', name: 'C6: Global challenges', subtopics: [
        { id: 'c6.1', name: 'Improving processes and products' },
        { id: 'c6.2', name: 'Interpreting and interacting with Earth systems' }
      ]},
    ],
    Biology: [
      { id: 'b1', name: 'B1: Cell level systems', subtopics: [
        { id: 'b1.1', name: 'Cell structures' },
        { id: 'b1.2', name: 'What happens in cells' },
        { id: 'b1.3', name: 'Respiration' },
        { id: 'b1.4', name: 'Photosynthesis' }
      ]},
      { id: 'b2', name: 'B2: Scaling up', subtopics: [
        { id: 'b2.1', name: 'Supplying the cell' },
        { id: 'b2.2', name: 'The challenges of size' }
      ]},
      { id: 'b3', name: 'B3: Organism level systems', subtopics: [
        { id: 'b3.1', name: 'Coordination and control – nervous system' },
        { id: 'b3.2', name: 'Coordination and control – endocrine system' },
        { id: 'b3.3', name: 'Maintaining internal environments' }
      ]},
      { id: 'b4', name: 'B4: Community level systems', subtopics: [
        { id: 'b4.1', name: 'Ecosystems' }
      ]},
      { id: 'b5', name: 'B5: Genes, inheritance and selection', subtopics: [
        { id: 'b5.1', name: 'Inheritance' },
        { id: 'b5.2', name: 'Natural selection and evolution' }
      ]},
      { id: 'b6', name: 'B6: Global challenges', subtopics: [
        { id: 'b6.1', name: 'Monitoring and maintaining the environment' },
        { id: 'b6.2', name: 'Feeding the human race' },
        { id: 'b6.3', name: 'Monitoring and maintaining health' }
      ]},
    ],
    Physics: [
      { id: 'p1', name: 'P1: Matter', subtopics: [
        { id: 'p1.1', name: 'The particle model' },
        { id: 'p1.2', name: 'Changes of state' }
      ]},
      { id: 'p2', name: 'P2: Forces', subtopics: [
        { id: 'p2.1', name: 'Motion' },
        { id: 'p2.2', name: 'Newton\'s laws' },
        { id: 'p2.3', name: 'Forces in action' }
      ]},
      { id: 'p3', name: 'P3: Electricity and magnetism', subtopics: [
        { id: 'p3.1', name: 'Static and Charge' },
        { id: 'p3.2', name: 'Simple circuits' },
        { id: 'p3.3', name: 'Magnets and magnetic fields' }
      ]},
      { id: 'p4', name: 'P4: Waves and radioactivity', subtopics: [
        { id: 'p4.1', name: 'Wave behaviour' },
        { id: 'p4.2', name: 'The electromagnetic spectrum' },
        { id: 'p4.3', name: 'Radioactivity' }
      ]},
      { id: 'p5', name: 'P5: Energy', subtopics: [
        { id: 'p5.1', name: 'Work done' },
        { id: 'p5.2', name: 'Power and efficiency' }
      ]},
      { id: 'p6', name: 'P6: Global challenges', subtopics: [
        { id: 'p6.1', name: 'Physics on the move' },
        { id: 'p6.2', name: 'Powering Earth' }
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
              {(['Chemistry', 'Biology', 'Physics', 'Maths'] as Subject[]).map((subj) => (
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
