import { ApiQuestion, Question } from '../types';

const API_BASE_URL = 'https://opentdb.com/api.php';
const SESSION_TOKEN_URL = 'https://opentdb.com/api_token.php?command=request';
const RESET_TOKEN_URL = 'https://opentdb.com/api_token.php?command=reset&token=';

let sessionToken: string | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getSessionToken = async (): Promise<string> => {
  try {
    const response = await fetch(SESSION_TOKEN_URL);
    if (!response.ok) {
      throw new Error('Failed to get session token');
    }
    const data = await response.json();
    if (data.response_code !== 0) {
      throw new Error('Invalid session token response');
    }
    return data.token;
  } catch (error) {
    console.error('Error getting session token:', error);
    throw error;
  }
};

const resetSessionToken = async (token: string): Promise<void> => {
  try {
    await fetch(`${RESET_TOKEN_URL}${token}`);
  } catch (error) {
    console.error('Error resetting session token:', error);
  }
};

export const fetchQuestions = async (
  amount: number = 10,
  difficulty?: string
): Promise<Question[]> => {
  // Clamp amount to 5-10 as requested
  const clampedAmount = Math.max(5, Math.min(10, Math.floor(amount)));

  // 1) Primary: Use public endpoints you provided (no token)
  const publicParams = new URLSearchParams({
    amount: clampedAmount.toString(),
    type: 'multiple',
  });
  if (difficulty) publicParams.append('difficulty', difficulty);

  const maxRetries = 3;
  let lastError: Error = new Error('Unknown');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${API_BASE_URL}?${publicParams}`);
      if (!response.ok) {
        if (response.status === 429 && attempt < maxRetries) {
          await delay(2000 * attempt);
          continue;
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch questions`);
      }
      const data = await response.json();
      if (data.response_code !== 0) {
        throw new Error('No questions available for the selected criteria');
      }
      return mapApiQuestions(data.results, clampedAmount);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      console.error(`[Public fetch] Attempt ${attempt} failed:`, lastError.message);
      if (attempt < maxRetries) {
        await delay(1000 * attempt);
      }
    }
  }

  // 2) Secondary: Try token-based fetch to avoid duplicates if public fails
  try {
    if (!sessionToken) {
      sessionToken = await getSessionToken();
    }
    const tokenParams = new URLSearchParams({
      amount: clampedAmount.toString(),
      type: 'multiple',
      token: sessionToken,
    });
    if (difficulty) tokenParams.append('difficulty', difficulty);

    const tokenResp = await fetch(`${API_BASE_URL}?${tokenParams}`);
    if (tokenResp.ok) {
      const tokenData = await tokenResp.json();
      if (tokenData.response_code === 3 || tokenData.response_code === 4) {
        sessionToken = await getSessionToken();
        tokenParams.set('token', sessionToken);
        const retry = await fetch(`${API_BASE_URL}?${tokenParams}`);
        const retryData = await retry.json();
        if (retryData.response_code === 0) {
          return mapApiQuestions(retryData.results, clampedAmount);
        }
      } else if (tokenData.response_code === 0) {
        return mapApiQuestions(tokenData.results, clampedAmount);
      }
    }
  } catch (e) {
    console.warn('[Token fetch] fallback failed:', e);
  }

  // 3) Final fallback: built-in defaults
  return mapApiQuestions(defaultFallbackQuestions.slice(0, clampedAmount), clampedAmount);
};

const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

const mapApiQuestions = (apiResults: ApiQuestion[], amount: number): Question[] => {
  return apiResults.slice(0, amount).map((q: ApiQuestion, index: number): Question => {
    const options = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);
    return {
      id: `q_${index}`,
      question: decodeHtmlEntities(q.question),
      options: options.map(decodeHtmlEntities),
      correctAnswer: decodeHtmlEntities(q.correct_answer),
      category: decodeHtmlEntities(q.category),
      difficulty: (q.difficulty as 'easy' | 'medium' | 'hard') || 'easy',
    };
  });
};

// Local in-code fallback to avoid relying on a deleted/missing public file
const defaultFallbackQuestions: ApiQuestion[] = [
  {
    category: 'General Knowledge',
    type: 'multiple',
    difficulty: 'easy',
    question: 'What is the capital city of France?',
    correct_answer: 'Paris',
    incorrect_answers: ['Lyon', 'Marseille', 'Nice'],
  },
  {
    category: 'Science',
    type: 'multiple',
    difficulty: 'easy',
    question: 'What planet is known as the Red Planet?',
    correct_answer: 'Mars',
    incorrect_answers: ['Venus', 'Jupiter', 'Saturn'],
  },
  {
    category: 'Entertainment',
    type: 'multiple',
    difficulty: 'medium',
    question: "Who directed the movie 'Inception'?",
    correct_answer: 'Christopher Nolan',
    incorrect_answers: ['James Cameron', 'Steven Spielberg', 'Quentin Tarantino'],
  },
  {
    category: 'History',
    type: 'multiple',
    difficulty: 'medium',
    question: 'In what year did World War II end?',
    correct_answer: '1945',
    incorrect_answers: ['1944', '1939', '1950'],
  },
  {
    category: 'Geography',
    type: 'multiple',
    difficulty: 'easy',
    question: 'Which continent is the Sahara Desert located on?',
    correct_answer: 'Africa',
    incorrect_answers: ['Asia', 'Australia', 'South America'],
  },
  {
    category: 'Sports',
    type: 'multiple',
    difficulty: 'easy',
    question: 'How many players are on the field for one soccer team?',
    correct_answer: '11',
    incorrect_answers: ['10', '9', '12'],
  },
  {
    category: 'Science',
    type: 'multiple',
    difficulty: 'hard',
    question: 'What is the chemical symbol for Gold?',
    correct_answer: 'Au',
    incorrect_answers: ['Ag', 'Gd', 'Go'],
  },
  {
    category: 'General Knowledge',
    type: 'multiple',
    difficulty: 'medium',
    question: 'Which language has the most native speakers?',
    correct_answer: 'Mandarin Chinese',
    incorrect_answers: ['English', 'Spanish', 'Hindi'],
  },
  {
    category: 'Technology',
    type: 'multiple',
    difficulty: 'medium',
    question: "What does 'CPU' stand for?",
    correct_answer: 'Central Processing Unit',
    incorrect_answers: ['Central Power Unit', 'Computer Processing Unit', 'Central Program Unit'],
  },
  {
    category: 'Mathematics',
    type: 'multiple',
    difficulty: 'easy',
    question: 'What is the value of π (pi) rounded to two decimal places?',
    correct_answer: '3.14',
    incorrect_answers: ['3.13', '3.15', '3.16'],
  },
];