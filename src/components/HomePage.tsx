import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Play, Trophy, Clock, Target } from 'lucide-react';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const features = [
    {
      icon: Brain,
      title: 'Diverse Topics',
      description: 'Questions from multiple categories to test your knowledge'
    },
    {
      icon: Clock,
      title: 'Timed Challenge',
      description: '30 seconds per question to keep you on your toes'
    },
    {
      icon: Target,
      title: 'Instant Feedback',
      description: 'See correct answers immediately after each question'
    },
    {
      icon: Trophy,
      title: 'Detailed Results',
      description: 'Comprehensive review of your performance'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-6xl font-bold text-gray-800 mb-6"
          >
            Quiz Master
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Test your knowledge with our interactive quiz featuring questions from various topics. 
            Challenge yourself and see how well you can score!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col items-center space-y-4"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Number of Questions
              </label>
              <div className="flex space-x-2">
                {[5, 6, 7, 8, 9, 10].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      questionCount === count
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg w-full">
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Difficulty
              </label>
              <div className="flex justify-center space-x-2">
                {(['easy', 'medium', 'hard'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all duration-200 ${
                      difficulty === level
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            <motion.button
              onClick={() => navigate('/quiz', { state: { questionCount, difficulty, newSession: true } })}
              className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              <span>Start Quiz ({questionCount} • {difficulty})</span>
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Answer Questions</h3>
                <p className="text-sm text-gray-600">5-10 multiple choice questions with 30 seconds each</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Get Feedback</h3>
                <p className="text-sm text-gray-600">See correct answers instantly after each question</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-pink-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">View Results</h3>
                <p className="text-sm text-gray-600">Review your performance and try again</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;