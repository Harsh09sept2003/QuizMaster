import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (selectedOption: string) => void;
  isAnswered: boolean;
  selectedOption?: string;
  showFeedback: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  isAnswered,
  selectedOption,
  showFeedback,
}) => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const getOptionClassName = (option: string) => {
    let baseClass = 'w-full p-4 text-left rounded-lg border-2 transition-all duration-300 font-medium';
    
    if (showFeedback) {
      if (option === question.correctAnswer) {
        baseClass += ' bg-green-100 border-green-500 text-green-800';
      } else if (option === selectedOption && option !== question.correctAnswer) {
        baseClass += ' bg-red-100 border-red-500 text-red-800';
      } else {
        baseClass += ' bg-gray-50 border-gray-300 text-gray-600';
      }
    } else if (selectedOption === option) {
      baseClass += ' bg-blue-100 border-blue-500 text-blue-800 transform scale-[1.02]';
    } else if (hoveredOption === option && !isAnswered) {
      baseClass += ' bg-gray-50 border-gray-400 text-gray-800 transform scale-[1.01]';
    } else {
      baseClass += ' bg-white border-gray-300 text-gray-700 hover:border-gray-400';
    }
    
    if (isAnswered && !showFeedback) {
      baseClass += ' cursor-not-allowed opacity-70';
    } else if (!isAnswered) {
      baseClass += ' cursor-pointer';
    }
    
    return baseClass;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-orange-600 bg-orange-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {question.category}
          </span>
        </div>
        
        <motion.h2 
          className="text-2xl font-bold text-gray-800 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {question.question}
        </motion.h2>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {question.options.map((option, index) => (
            <motion.button
              key={option}
              className={getOptionClassName(option)}
              onClick={() => !isAnswered && onAnswer(option)}
              onMouseEnter={() => !isAnswered && setHoveredOption(option)}
              onMouseLeave={() => setHoveredOption(null)}
              disabled={isAnswered}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={!isAnswered ? { scale: 1.01 } : {}}
              whileTap={!isAnswered ? { scale: 0.99 } : {}}
            >
              <div className="flex items-center justify-between">
                <span className="flex-1 text-left">{option}</span>
                {showFeedback && option === question.correctAnswer && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </motion.div>
                )}
                {showFeedback && option === selectedOption && option !== question.correctAnswer && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <XCircle className="w-6 h-6 text-red-600" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuestionCard;