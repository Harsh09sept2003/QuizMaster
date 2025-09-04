import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';

interface TimerProps {
  onTimeUp: () => void;
  isAnswered: boolean;
}

const Timer: React.FC<TimerProps> = ({ onTimeUp, isAnswered }) => {
  const { state, dispatch } = useQuiz();
  const { timeRemaining } = state;

  useEffect(() => {
    if (isAnswered || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      dispatch({ type: 'SET_TIME_REMAINING', payload: timeRemaining - 1 });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isAnswered, dispatch]);

  useEffect(() => {
    if (timeRemaining <= 0 && !isAnswered) {
      onTimeUp();
    }
  }, [timeRemaining, isAnswered, onTimeUp]);

  const getTimerColor = () => {
    if (timeRemaining <= 5) return 'text-red-600';
    if (timeRemaining <= 10) return 'text-orange-600';
    return 'text-green-600';
  };

  const getProgressColor = () => {
    if (timeRemaining <= 5) return 'from-red-500 to-red-600';
    if (timeRemaining <= 10) return 'from-orange-500 to-orange-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <motion.div 
      className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-sm border"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Clock className={`w-5 h-5 ${getTimerColor()}`} />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Time Remaining</span>
          <span className={`text-lg font-bold ${getTimerColor()}`}>
            {timeRemaining}s
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full`}
            initial={{ width: '100%' }}
            animate={{ width: `${(timeRemaining / 30) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Timer;