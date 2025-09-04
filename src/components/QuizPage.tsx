import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, XCircle, CheckCircle } from 'lucide-react';

type ApiQuestion = {
  category: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};

type Question = {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: string;
};

type UserAnswer = {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  timeSpent: number;
};

const API_BASE = 'https://opentdb.com/api.php';

const clampAmount = (n: number) => Math.max(5, Math.min(10, Math.floor(n)));

const decodeHtml = (text: string) => {
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
};

const mapQuestions = (results: ApiQuestion[]): Question[] =>
  results.map((q, i) => {
    const options = [...q.incorrect_answers, q.correct_answer]
      .map(decodeHtml)
      .sort(() => Math.random() - 0.5);
    return {
      id: `q_${i}`,
      category: decodeHtml(q.category),
      difficulty: q.difficulty,
      question: decodeHtml(q.question),
      options,
      correctAnswer: decodeHtml(q.correct_answer),
    };
  });

// Offline cache helpers
const offlineKey = (diff: string | undefined, amount: number) => `offlineQuestions_${diff || 'any'}_${amount}`;

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { questionCount = 10, difficulty } = (location.state as {
    questionCount?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
  }) || {};

  // Guard: Only accessible from Home with preferences
  useEffect(() => {
    const hasPrefs = (location.state as any) && ((location.state as any).questionCount || (location.state as any).difficulty);
    if (!hasPrefs) navigate('/', { replace: true });
  }, [location.state, navigate]);

  const amount = useMemo(() => clampAmount(questionCount), [questionCount]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  const current = questions[currentIndex];
  const existing = current ? answers.find(a => a.questionId === current.id) : undefined;
  const isAnswered = !!existing;
  const isLast = currentIndex === (questions.length - 1);

  useEffect(() => {
    let cancelled = false;
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ amount: String(amount), type: 'multiple' });
        if (difficulty) params.append('difficulty', difficulty);
        const resp = await fetch(`${API_BASE}?${params}`);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        if (data.response_code !== 0) throw new Error('No questions available');
        const mapped = mapQuestions(data.results as ApiQuestion[]);
        if (!cancelled) {
          setQuestions(mapped);
          // store offline
          try {
            localStorage.setItem(offlineKey(difficulty, amount), JSON.stringify(mapped));
          } catch { /* ignore quota errors */ }
        }
      } catch (e) {
        // Network or API error: try offline cache, else show error
        try {
          const cached = localStorage.getItem(offlineKey(difficulty, amount));
          if (cached) {
            const mapped: Question[] = JSON.parse(cached);
            if (!cancelled) setQuestions(mapped);
          } else if (!cancelled) {
            setError(e instanceof Error ? e.message : 'Failed to load questions');
          }
        } catch {
          if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load questions');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchQuestions();
    return () => { cancelled = true; };
  }, [amount, difficulty]);

  // Reset and run a 30s timer per question
  useEffect(() => {
    setTimeLeft(30);
    if (!questions.length) return;
    if (isAnswered) return; // stop counting if already answered
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // auto-submit as unanswered on timeout
          if (!isAnswered && questions[currentIndex]) {
            submitAnswer('');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, questions.length, isAnswered]);

  const submitAnswer = (option: string) => {
    if (!current || isAnswered) return;
    const entry: UserAnswer = {
      questionId: current.id,
      selectedOption: option,
      isCorrect: option === current.correctAnswer,
      timeSpent: 30 - timeLeft,
    };
    setAnswers(prev => [...prev, entry]);
  };

  const next = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(i => i + 1);
  };
  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1);
  };

  const score = useMemo(() => answers.filter(a => a.isCorrect).length, [answers]);
  const finished = questions.length > 0 && answers.length === questions.length;

  // Navigate to results automatically when all questions attempted
  useEffect(() => {
    if (!finished) return;
    navigate('/results', {
      replace: true,
      state: {
        summary: {
          score,
          total: questions.length,
          answers,
          questions,
        }
      }
    });
  }, [finished, score, questions, answers, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <motion.div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto mb-4 animate-pulse" />
          <div className="text-lg font-semibold text-gray-800">Loading your quiz…</div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <motion.div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Go Home</button>
        </motion.div>
      </div>
    );
  }

  if (!current) {
    return null;
  }

  const optionClass = (option: string) => {
    let base = 'w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-medium';
    if (isAnswered) {
      if (option === current.correctAnswer) base += ' bg-green-100 border-green-500 text-green-800';
      else if (existing?.selectedOption === option) base += ' bg-red-100 border-red-500 text-red-800';
      else base += ' bg-gray-50 border-gray-300 text-gray-600';
    } else {
      base += ' bg-white border-gray-300 text-gray-700 hover:border-gray-400';
    }
    if (isAnswered) base += ' cursor-not-allowed opacity-70';
    else base += ' cursor-pointer';
    return base;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Question {currentIndex + 1} / {questions.length}</div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-gray-100 text-gray-700">
              {current.category}
            </span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={current.id} className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-blue-100 text-blue-700">{current.difficulty}</span>
              <div className="flex items-center space-x-4 text-gray-500 text-sm">
                <div>Time: {timeLeft}s</div>
                <div>Score: {score}/{answers.length}</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 leading-relaxed mb-6">{current.question}</h2>
            <div className="space-y-4">
              {current.options.map((opt, idx) => (
                <motion.button key={opt} className={optionClass(opt)} onClick={() => submitAnswer(opt)} disabled={isAnswered} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * idx, duration: 0.25 }}>
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-left">{opt}</span>
                    {isAnswered && opt === current.correctAnswer && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div className="flex justify-between items-center mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <button onClick={prev} disabled={currentIndex === 0} className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all duration-200 disabled:hover:bg-gray-600">
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {!finished ? (
            <div className="text-sm text-gray-600">{answers.length > 0 ? `${Math.round((score / answers.length) * 100)}% accuracy` : 'No answers yet'}</div>
          ) : <div />}

          <button onClick={next} disabled={!isAnswered || currentIndex === questions.length - 1} className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all duration-200 disabled:hover:bg-blue-600">
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizPage;