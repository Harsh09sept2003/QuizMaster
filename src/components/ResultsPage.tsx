import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

const ResultsPage: React.FC = () => {
  const { state, dispatch } = useQuiz();
  const location = useLocation();
  const navigate = useNavigate();
  
  const navSummary = (location.state as any)?.summary as | {
    score: number;
    total: number;
    answers: { questionId: string; selectedOption: string; isCorrect: boolean; timeSpent?: number }[];
    questions: { id: string; question: string; correctAnswer: string; difficulty: 'easy'|'medium'|'hard' }[];
  } | undefined;

  const questions = navSummary?.questions ?? state.questions;
  const userAnswers = navSummary?.answers ?? state.userAnswers;
  const score = navSummary?.score ?? state.score;
  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  const getScoreMessage = () => {
    if (percentage >= 90) return 'Excellent! Outstanding performance! 🎉';
    if (percentage >= 80) return 'Great job! Well done! 👏';
    if (percentage >= 70) return 'Good work! Keep it up! 👍';
    if (percentage >= 60) return 'Not bad! Room for improvement! 📚';
    return 'Keep practicing! You\'ll do better next time! 💪';
  };

  const getScoreColor = () => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleRestart = () => {
    dispatch({ type: 'RESTART_QUIZ' });
    navigate('/quiz');
  };

  const averageTime = userAnswers.length > 0 
    ? userAnswers.reduce((acc: number, answer: any) => acc + (typeof answer.timeSpent === 'number' ? answer.timeSpent : 30), 0) / userAnswers.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-12 h-12 text-yellow-600" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            Quiz Complete!
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`}>
              {score}/{totalQuestions}
            </div>
            <div className={`text-2xl font-semibold mb-2 ${getScoreColor()}`}>
              {percentage}% Score
            </div>
            <p className="text-lg text-gray-600 mb-4">{getScoreMessage()}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{totalQuestions - score}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{averageTime.toFixed(1)}s</div>
                <div className="text-sm text-gray-600">Avg. Time</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Your Answers</h2>
          
          <div className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer?.isCorrect ?? false;
              
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="border rounded-lg p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Question {index + 1}
                      </h3>
                      <p className="text-gray-700 mb-4">{question.question}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className={`p-3 rounded-lg ${userAnswer?.selectedOption === question.correctAnswer ? 'bg-green-100' : 'bg-red-100'}`}>
                          <div className="text-sm text-gray-600">Your Answer:</div>
                          <div className="font-medium">
                            {userAnswer?.selectedOption || 'No answer'}
                          </div>
                        </div>
                        
                        <div className="p-3 rounded-lg bg-green-100">
                          <div className="text-sm text-gray-600">Correct Answer:</div>
                          <div className="font-medium text-green-800">
                            {question.correctAnswer}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{userAnswer?.timeSpent || 30}s</span>
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          question.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
                          question.difficulty === 'medium' ? 'bg-orange-100 text-orange-600' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="text-center"
        >
          <button
            onClick={handleRestart}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Take Quiz Again</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;