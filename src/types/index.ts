// Types for the AI Learning Assistant Platform

export type UserRole = 'student' | 'teacher';

export type Subject = 'maths' | 'chemistry' | 'biology' | 'computer-science' | 'french' | 'music';

export type ExamBoard = 'Edexcel' | 'AQA' | 'OCR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  subjects: Subject[];
  examBoard?: ExamBoard;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  dueDate: Date;
  teacherId: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
  feedback?: string;
}

export interface Flashcard {
  id: string;
  subject: Subject;
  topic: string;
  question: string;
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: Date;
  nextReview?: Date;
  confidence: number; // 0-100
}

export interface PracticeQuestion {
  id: string;
  subject: Subject;
  topic: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
}

export interface ClassroomQuestion {
  id: string;
  studentId: string;
  lessonId: string;
  question: string;
  topic: string;
  timestamp: Date;
  anonymous: boolean;
  answered: boolean;
  category?: string;
}

export interface Lesson {
  id: string;
  title: string;
  subject: Subject;
  teacherId: string;
  scheduledTime: Date;
  duration: number; // minutes
  status: 'scheduled' | 'live' | 'recorded';
  recordingUrl?: string;
  chapters?: LessonChapter[];
  notes?: string;
}

export interface LessonChapter {
  id: string;
  title: string;
  timestamp: number; // seconds
}

export interface StudyProgress {
  subject: Subject;
  topicsCompleted: number;
  totalTopics: number;
  flashcardsReviewed: number;
  questionsAnswered: number;
  correctAnswers: number;
  streakDays: number;
  lastStudied: Date;
}

export interface Notification {
  id: string;
  type: 'message' | 'assignment' | 'lesson' | 'question' | 'reminder';
  title: string;
  content: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface AIResponse {
  id: string;
  query: string;
  response: string;
  subject?: Subject;
  topic?: string;
  timestamp: Date;
  helpful?: boolean;
}
