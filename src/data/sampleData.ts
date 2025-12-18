import { User, Message, Assignment, Flashcard, PracticeQuestion, Lesson, StudyProgress, ClassroomQuestion, Notification } from '@/types';

// Sample Users
export const sampleStudents: User[] = [
  {
    id: 'student-1',
    name: 'Alex Thompson',
    email: 'alex.thompson@school.edu',
    role: 'student',
    avatar: 'AT',
    subjects: ['maths', 'chemistry', 'computer-science'],
    examBoard: 'Edexcel',
  },
  {
    id: 'student-2',
    name: 'Emma Wilson',
    email: 'emma.wilson@school.edu',
    role: 'student',
    avatar: 'EW',
    subjects: ['biology', 'chemistry', 'french'],
    examBoard: 'AQA',
  },
  {
    id: 'student-3',
    name: 'James Chen',
    email: 'james.chen@school.edu',
    role: 'student',
    avatar: 'JC',
    subjects: ['maths', 'music', 'french'],
    examBoard: 'OCR',
  },
];

export const sampleTeachers: User[] = [
  {
    id: 'teacher-1',
    name: 'Dr. Sarah Mitchell',
    email: 's.mitchell@school.edu',
    role: 'teacher',
    avatar: 'SM',
    subjects: ['maths', 'computer-science'],
  },
  {
    id: 'teacher-2',
    name: 'Mr. David Roberts',
    email: 'd.roberts@school.edu',
    role: 'teacher',
    avatar: 'DR',
    subjects: ['chemistry', 'biology'],
  },
];

// Sample Messages
export const sampleMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'teacher-1',
    receiverId: 'student-1',
    content: 'Great work on your calculus homework! I noticed you struggled a bit with integration by parts. Would you like to schedule some extra help?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 'msg-2',
    senderId: 'student-1',
    receiverId: 'teacher-1',
    content: 'Thank you Dr. Mitchell! Yes, I would appreciate some extra help with integration. When would be a good time?',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'msg-3',
    senderId: 'teacher-2',
    receiverId: 'student-1',
    content: 'Remember to submit your chemistry lab report by Friday. Let me know if you have any questions about the methodology section.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
];

// Sample Assignments
export const sampleAssignments: Assignment[] = [
  {
    id: 'assign-1',
    title: 'Quadratic Equations Practice',
    description: 'Complete exercises 1-20 from Chapter 5. Show all working.',
    subject: 'maths',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    teacherId: 'teacher-1',
    status: 'pending',
  },
  {
    id: 'assign-2',
    title: 'Chemistry Lab Report: Titration',
    description: 'Write up your findings from the acid-base titration experiment.',
    subject: 'chemistry',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    teacherId: 'teacher-2',
    status: 'pending',
  },
  {
    id: 'assign-3',
    title: 'Python Programming Challenge',
    description: 'Create a program that sorts a list of numbers using bubble sort.',
    subject: 'computer-science',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    teacherId: 'teacher-1',
    status: 'submitted',
  },
];

// Sample Flashcards
export const sampleFlashcards: Flashcard[] = [
  // Maths
  { id: 'fc-m1', subject: 'maths', topic: 'Algebra', question: 'What is the quadratic formula?', answer: 'x = (-b ± √(b² - 4ac)) / 2a', difficulty: 'medium', confidence: 75 },
  { id: 'fc-m2', subject: 'maths', topic: 'Algebra', question: 'How do you factorise x² - 9?', answer: '(x + 3)(x - 3) - this is a difference of squares', difficulty: 'easy', confidence: 90 },
  { id: 'fc-m3', subject: 'maths', topic: 'Trigonometry', question: 'What is sin(30°)?', answer: '1/2 or 0.5', difficulty: 'easy', confidence: 85 },
  { id: 'fc-m4', subject: 'maths', topic: 'Calculus', question: 'What is the derivative of x²?', answer: '2x (using power rule: d/dx[xⁿ] = nxⁿ⁻¹)', difficulty: 'medium', confidence: 60 },
  { id: 'fc-m5', subject: 'maths', topic: 'Statistics', question: 'What is the formula for standard deviation?', answer: 'σ = √(Σ(x - μ)² / N)', difficulty: 'hard', confidence: 40 },
  
  // Chemistry
  { id: 'fc-c1', subject: 'chemistry', topic: 'Atomic Structure', question: 'What are the three subatomic particles?', answer: 'Protons (positive), Neutrons (neutral), Electrons (negative)', difficulty: 'easy', confidence: 95 },
  { id: 'fc-c2', subject: 'chemistry', topic: 'Bonding', question: 'What is a covalent bond?', answer: 'A bond formed by sharing electrons between atoms', difficulty: 'easy', confidence: 80 },
  { id: 'fc-c3', subject: 'chemistry', topic: 'Reactions', question: 'What is the word equation for photosynthesis?', answer: 'Carbon dioxide + Water → Glucose + Oxygen', difficulty: 'medium', confidence: 70 },
  { id: 'fc-c4', subject: 'chemistry', topic: 'Acids & Bases', question: 'What is the pH of a neutral solution?', answer: 'pH 7', difficulty: 'easy', confidence: 100 },
  { id: 'fc-c5', subject: 'chemistry', topic: 'Periodic Table', question: 'What group are the halogens in?', answer: 'Group 7 (or Group 17 in IUPAC)', difficulty: 'medium', confidence: 65 },

  // Biology
  { id: 'fc-b1', subject: 'biology', topic: 'Cells', question: 'What is the function of mitochondria?', answer: 'The powerhouse of the cell - produces ATP through cellular respiration', difficulty: 'easy', confidence: 85 },
  { id: 'fc-b2', subject: 'biology', topic: 'DNA', question: 'What are the four bases in DNA?', answer: 'Adenine (A), Thymine (T), Guanine (G), Cytosine (C)', difficulty: 'medium', confidence: 75 },
  { id: 'fc-b3', subject: 'biology', topic: 'Evolution', question: 'What is natural selection?', answer: 'The process where organisms better adapted to their environment tend to survive and reproduce', difficulty: 'medium', confidence: 60 },

  // Computer Science
  { id: 'fc-cs1', subject: 'computer-science', topic: 'Algorithms', question: 'What is Big O notation?', answer: 'A way to describe the time/space complexity of an algorithm as input size grows', difficulty: 'hard', confidence: 45 },
  { id: 'fc-cs2', subject: 'computer-science', topic: 'Data Types', question: 'What is the difference between int and float?', answer: 'Int stores whole numbers, float stores decimal numbers', difficulty: 'easy', confidence: 90 },
  { id: 'fc-cs3', subject: 'computer-science', topic: 'Networks', question: 'What does TCP/IP stand for?', answer: 'Transmission Control Protocol / Internet Protocol', difficulty: 'medium', confidence: 55 },

  // French
  { id: 'fc-f1', subject: 'french', topic: 'Verbs', question: 'Conjugate "être" in present tense', answer: 'je suis, tu es, il/elle est, nous sommes, vous êtes, ils/elles sont', difficulty: 'medium', confidence: 70 },
  { id: 'fc-f2', subject: 'french', topic: 'Vocabulary', question: 'What is "the library" in French?', answer: 'La bibliothèque', difficulty: 'easy', confidence: 80 },

  // Music
  { id: 'fc-mu1', subject: 'music', topic: 'Theory', question: 'How many semitones in an octave?', answer: '12 semitones', difficulty: 'easy', confidence: 95 },
  { id: 'fc-mu2', subject: 'music', topic: 'Theory', question: 'What is a perfect fifth interval?', answer: '7 semitones apart (e.g., C to G)', difficulty: 'medium', confidence: 65 },
];

// Sample Practice Questions
export const samplePracticeQuestions: PracticeQuestion[] = [
  // Maths
  {
    id: 'pq-m1',
    subject: 'maths',
    topic: 'Algebra',
    question: 'Solve for x: 2x + 5 = 13',
    options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
    correctAnswer: 'x = 4',
    explanation: 'Subtract 5 from both sides: 2x = 8. Then divide by 2: x = 4',
    difficulty: 'easy',
    marks: 2,
  },
  {
    id: 'pq-m2',
    subject: 'maths',
    topic: 'Algebra',
    question: 'Factorise: x² + 5x + 6',
    options: ['(x + 2)(x + 3)', '(x + 1)(x + 6)', '(x - 2)(x - 3)', '(x + 2)(x - 3)'],
    correctAnswer: '(x + 2)(x + 3)',
    explanation: 'Find two numbers that multiply to 6 and add to 5: 2 and 3',
    difficulty: 'medium',
    marks: 3,
  },
  {
    id: 'pq-m3',
    subject: 'maths',
    topic: 'Trigonometry',
    question: 'In a right triangle with opposite = 3 and hypotenuse = 5, what is sin(θ)?',
    options: ['3/5', '4/5', '3/4', '5/3'],
    correctAnswer: '3/5',
    explanation: 'sin(θ) = opposite/hypotenuse = 3/5',
    difficulty: 'easy',
    marks: 2,
  },
  {
    id: 'pq-m4',
    subject: 'maths',
    topic: 'Calculus',
    question: 'Find the derivative of f(x) = 3x³ + 2x',
    options: ['9x² + 2', '9x³ + 2x', 'x² + 2', '3x² + 2'],
    correctAnswer: '9x² + 2',
    explanation: 'Using power rule: d/dx[3x³] = 9x², d/dx[2x] = 2',
    difficulty: 'medium',
    marks: 3,
  },
  {
    id: 'pq-m5',
    subject: 'maths',
    topic: 'Probability',
    question: 'A fair dice is rolled twice. What is the probability of getting two 6s?',
    options: ['1/36', '1/6', '1/12', '2/6'],
    correctAnswer: '1/36',
    explanation: 'P(6 and 6) = 1/6 × 1/6 = 1/36',
    difficulty: 'medium',
    marks: 3,
  },

  // Chemistry
  {
    id: 'pq-c1',
    subject: 'chemistry',
    topic: 'Atomic Structure',
    question: 'How many electrons does a neutral oxygen atom have?',
    options: ['6', '8', '16', '2'],
    correctAnswer: '8',
    explanation: 'Oxygen has atomic number 8, so neutral oxygen has 8 electrons',
    difficulty: 'easy',
    marks: 1,
  },
  {
    id: 'pq-c2',
    subject: 'chemistry',
    topic: 'Bonding',
    question: 'Which type of bonding occurs in sodium chloride (NaCl)?',
    options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'],
    correctAnswer: 'Ionic',
    explanation: 'Na donates an electron to Cl, forming Na⁺ and Cl⁻ ions',
    difficulty: 'easy',
    marks: 1,
  },
  {
    id: 'pq-c3',
    subject: 'chemistry',
    topic: 'Reactions',
    question: 'Balance this equation: H₂ + O₂ → H₂O',
    options: ['2H₂ + O₂ → 2H₂O', 'H₂ + 2O₂ → H₂O', 'H₂ + O₂ → 2H₂O', 'Already balanced'],
    correctAnswer: '2H₂ + O₂ → 2H₂O',
    explanation: 'Need 4 H atoms and 2 O atoms on each side',
    difficulty: 'medium',
    marks: 2,
  },
  {
    id: 'pq-c4',
    subject: 'chemistry',
    topic: 'Acids & Bases',
    question: 'What happens to pH when you add a base to an acidic solution?',
    options: ['Decreases', 'Increases', 'Stays the same', 'Becomes exactly 7'],
    correctAnswer: 'Increases',
    explanation: 'Adding base neutralises acid, moving pH towards 7 (increasing)',
    difficulty: 'easy',
    marks: 1,
  },
  {
    id: 'pq-c5',
    subject: 'chemistry',
    topic: 'Rates of Reaction',
    question: 'Which factor does NOT affect the rate of reaction?',
    options: ['Temperature', 'Concentration', 'Mass of products', 'Surface area'],
    correctAnswer: 'Mass of products',
    explanation: 'Rate depends on reactants, not products',
    difficulty: 'medium',
    marks: 2,
  },

  // Biology
  {
    id: 'pq-b1',
    subject: 'biology',
    topic: 'Cells',
    question: 'Which organelle is responsible for protein synthesis?',
    options: ['Mitochondria', 'Ribosome', 'Nucleus', 'Golgi apparatus'],
    correctAnswer: 'Ribosome',
    explanation: 'Ribosomes translate mRNA into proteins',
    difficulty: 'easy',
    marks: 1,
  },
  {
    id: 'pq-b2',
    subject: 'biology',
    topic: 'DNA',
    question: 'If one strand of DNA reads ATCG, what does the complementary strand read?',
    options: ['TAGC', 'AUCG', 'GCTA', 'CGAT'],
    correctAnswer: 'TAGC',
    explanation: 'A pairs with T, C pairs with G',
    difficulty: 'medium',
    marks: 2,
  },

  // Computer Science
  {
    id: 'pq-cs1',
    subject: 'computer-science',
    topic: 'Algorithms',
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 'O(log n)',
    explanation: 'Binary search halves the search space each iteration',
    difficulty: 'medium',
    marks: 2,
  },

  // French
  {
    id: 'pq-f1',
    subject: 'french',
    topic: 'Grammar',
    question: 'Complete: "Je ___ au cinéma hier" (I went to the cinema yesterday)',
    options: ['vais', 'suis allé', 'allais', 'irai'],
    correctAnswer: 'suis allé',
    explanation: 'Past tense (passé composé) with "aller" uses être as auxiliary',
    difficulty: 'medium',
    marks: 2,
  },

  // Music
  {
    id: 'pq-mu1',
    subject: 'music',
    topic: 'Theory',
    question: 'What key has no sharps or flats?',
    options: ['G major', 'C major', 'D major', 'F major'],
    correctAnswer: 'C major',
    explanation: 'C major is the only major key with no sharps or flats',
    difficulty: 'easy',
    marks: 1,
  },
];

// Sample Lessons
export const sampleLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Introduction to Calculus: Differentiation',
    subject: 'maths',
    teacherId: 'teacher-1',
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    duration: 60,
    status: 'scheduled',
  },
  {
    id: 'lesson-2',
    title: 'Organic Chemistry: Hydrocarbons',
    subject: 'chemistry',
    teacherId: 'teacher-2',
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    duration: 45,
    status: 'scheduled',
  },
  {
    id: 'lesson-3',
    title: 'Python Basics: Loops and Functions',
    subject: 'computer-science',
    teacherId: 'teacher-1',
    scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    duration: 50,
    status: 'recorded',
    recordingUrl: '/recordings/python-basics',
    chapters: [
      { id: 'ch-1', title: 'Introduction', timestamp: 0 },
      { id: 'ch-2', title: 'For Loops', timestamp: 600 },
      { id: 'ch-3', title: 'While Loops', timestamp: 1200 },
      { id: 'ch-4', title: 'Functions', timestamp: 1800 },
      { id: 'ch-5', title: 'Practice Problems', timestamp: 2400 },
    ],
  },
];

// Sample Study Progress
export const sampleProgress: StudyProgress[] = [
  {
    subject: 'maths',
    topicsCompleted: 12,
    totalTopics: 20,
    flashcardsReviewed: 45,
    questionsAnswered: 28,
    correctAnswers: 22,
    streakDays: 5,
    lastStudied: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    subject: 'chemistry',
    topicsCompleted: 8,
    totalTopics: 15,
    flashcardsReviewed: 32,
    questionsAnswered: 18,
    correctAnswers: 14,
    streakDays: 3,
    lastStudied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    subject: 'computer-science',
    topicsCompleted: 6,
    totalTopics: 12,
    flashcardsReviewed: 20,
    questionsAnswered: 15,
    correctAnswers: 13,
    streakDays: 7,
    lastStudied: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

// Sample Classroom Questions
export const sampleClassroomQuestions: ClassroomQuestion[] = [
  {
    id: 'cq-1',
    studentId: 'student-1',
    lessonId: 'lesson-1',
    question: 'Can you explain the chain rule again?',
    topic: 'Differentiation',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    anonymous: true,
    answered: false,
    category: 'Calculus',
  },
  {
    id: 'cq-2',
    studentId: 'student-2',
    lessonId: 'lesson-1',
    question: 'What\'s the difference between dy/dx and d/dx?',
    topic: 'Differentiation',
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    anonymous: true,
    answered: false,
    category: 'Calculus',
  },
  {
    id: 'cq-3',
    studentId: 'student-3',
    lessonId: 'lesson-1',
    question: 'When do we use product rule vs quotient rule?',
    topic: 'Differentiation',
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    anonymous: false,
    answered: true,
    category: 'Calculus',
  },
];

// Sample Notifications
export const sampleNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'message',
    title: 'New message from Dr. Mitchell',
    content: 'Great work on your calculus homework!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    actionUrl: '/messages',
  },
  {
    id: 'notif-2',
    type: 'assignment',
    title: 'Assignment due soon',
    content: 'Chemistry Lab Report due in 2 days',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
    actionUrl: '/assignments',
  },
  {
    id: 'notif-3',
    type: 'lesson',
    title: 'Upcoming lesson',
    content: 'Calculus lesson starts in 2 hours',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    actionUrl: '/lessons',
  },
];

// Helper functions
export const getSubjectLabel = (subject: string): string => {
  const labels: Record<string, string> = {
    'maths': 'Mathematics',
    'chemistry': 'Chemistry',
    'biology': 'Biology',
    'computer-science': 'Computer Science',
    'french': 'French',
    'music': 'Music',
  };
  return labels[subject] || subject;
};

export const getSubjectColor = (subject: string): string => {
  const colors: Record<string, string> = {
    'maths': 'subject-maths',
    'chemistry': 'subject-chemistry',
    'biology': 'subject-biology',
    'computer-science': 'subject-cs',
    'french': 'subject-french',
    'music': 'subject-music',
  };
  return colors[subject] || 'subject-maths';
};
