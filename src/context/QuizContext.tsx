import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { QuizState, Question, UserAnswer } from '../types';

type QuizAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'ANSWER_QUESTION'; payload: UserAnswer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREVIOUS_QUESTION' }
  | { type: 'SET_TIME_REMAINING'; payload: number }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'RESTART_QUIZ' }
  | { type: 'RESET_SESSION' };

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  isCompleted: false,
  isLoading: false,
  error: null,
  timeRemaining: 30,
  score: 0,
};

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: action.payload,
        currentQuestionIndex: 0,
        userAnswers: [],
        isCompleted: false,
        timeRemaining: 30,
        score: 0,
        isLoading: false,
        error: null,
      };
    
    case 'ANSWER_QUESTION':
      const newAnswers = [...state.userAnswers, action.payload];
      const newScore = newAnswers.filter(answer => answer.isCorrect).length;
      
      return {
        ...state,
        userAnswers: newAnswers,
        score: newScore,
      };
    
    case 'NEXT_QUESTION':
      const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
      
      return {
        ...state,
        currentQuestionIndex: isLastQuestion ? state.currentQuestionIndex : state.currentQuestionIndex + 1,
        isCompleted: isLastQuestion,
        timeRemaining: 30,
      };
    
    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        timeRemaining: 30,
      };
    
    case 'SET_TIME_REMAINING':
      return { ...state, timeRemaining: action.payload };
    
    case 'COMPLETE_QUIZ':
      return { ...state, isCompleted: true };
    
    case 'RESTART_QUIZ':
      return {
        ...initialState,
        questions: state.questions,
      };

    case 'RESET_SESSION':
      return {
        ...initialState,
      };
    
    default:
      return state;
  }
};

interface QuizContextType {
  state: QuizState;
  dispatch: React.Dispatch<QuizAction>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  // Initialize from localStorage if available
  const persisted = (() => {
    try {
      const raw = localStorage.getItem('quizState');
      return raw ? (JSON.parse(raw) as QuizState) : null;
    } catch {
      return null;
    }
  })();

  const [state, dispatch] = useReducer(quizReducer, persisted ?? initialState);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem('quizState', JSON.stringify(state));
    } catch {
      // ignore persistence errors
    }
  }, [state]);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
};