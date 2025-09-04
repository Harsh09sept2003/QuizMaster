export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UserAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isCompleted: boolean;
  isLoading: boolean;
  error: string | null;
  timeRemaining: number;
  score: number;
}

export interface ApiQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}