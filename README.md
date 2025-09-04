# Quiz Master - Interactive Trivia Challenge

A modern, responsive quiz application built with React, TypeScript, and Tailwind CSS. Features real-time scoring, timer functionality, and comprehensive results review.

## 🚀 Features

- **Interactive Quiz Experience**: 10 multiple-choice questions with 30-second timer per question
- **Real-time Feedback**: Instant correct/incorrect indication after each answer
- **Progress Tracking**: Visual progress bar and live score display
- **Comprehensive Results**: Detailed review of all answers with performance metrics
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations
- **API Integration**: Dynamic question loading from Open Trivia Database

## 🛠 Technical Stack

- **React 18** with TypeScript for type safety
- **React Router** for navigation between pages
- **Context API** for state management
- **Framer Motion** for smooth animations
- **Tailwind CSS** for styling
- **Vite** for fast development and building

## 📦 Installation & Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the local development URL

## 🎯 How to Play

1. **Start**: Click "Start Quiz" on the homepage
2. **Answer**: Select one of four options for each question
3. **Progress**: Navigate through questions with Previous/Next buttons
4. **Timer**: Each question has a 30-second countdown
5. **Results**: Review your performance and see correct answers
6. **Restart**: Take the quiz again to improve your score

## 🏗 Architecture & Design Decisions

### State Management
- **React Context**: Centralized state management for quiz data, user progress, and scoring
- **useReducer**: Complex state transitions handled through predictable reducer pattern
- **Custom Hooks**: Encapsulated quiz logic for reusable functionality

### Component Structure
- **Modular Design**: Each component has a single responsibility
- **Type Safety**: Full TypeScript integration with comprehensive interfaces
- **Reusable Components**: Shared components for consistent UI patterns

### API Integration
- **Error Handling**: Graceful handling of network errors and API failures
- **Data Transformation**: Normalization of API responses into consistent format
- **Loading States**: User-friendly loading indicators during data fetching

### User Experience
- **Progressive Enhancement**: Core functionality works even without JavaScript animations
- **Accessibility**: Keyboard navigation, ARIA labels, and focus management
- **Mobile Optimization**: Touch-friendly interactions and responsive layout

## 🚀 Build & Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design System

- **Typography**: Inter font family for optimal readability
- **Color Palette**: Blue-purple gradient theme with semantic color coding
- **Spacing**: Consistent 8px grid system
- **Animations**: Subtle micro-interactions for enhanced user engagement

## 📱 Responsive Breakpoints

- **Mobile**: < 768px - Single column layout
- **Tablet**: 768px - 1024px - Optimized for touch
- **Desktop**: > 1024px - Full feature display

Built with ❤️ for an optimal quiz experience.