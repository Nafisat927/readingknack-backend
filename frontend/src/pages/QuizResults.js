import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get quiz data from navigation state
  const { quizResult, document, questions, userAnswers } = location.state || {};

  // If no quiz data, redirect to home
  if (!quizResult) {
    navigate('/');
    return null;
  }

  const { score, total_questions, percentage } = quizResult;

  // Calculate which questions were answered correctly
  const getQuestionResult = (questionId) => {
    const userAnswer = userAnswers[questionId];
    const question = questions.find(q => q.id === parseInt(questionId));
    if (!question || !userAnswer) return null;
    
    const selectedAnswer = question.answers.find(a => a.id === userAnswer);
    return {
      question: question,
      selectedAnswer: selectedAnswer,
      isCorrect: selectedAnswer?.is_correct || false
    };
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return 'Excellent work! 🌟';
    if (percentage >= 80) return 'Great job! 👏';
    if (percentage >= 70) return 'Good work! 👍';
    if (percentage >= 60) return 'Not bad! 💪';
    return 'Keep practicing! 📚';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          <p className="text-gray-600">Here are your results for: <span className="font-semibold">{document?.title}</span></p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {getScoreMessage(percentage)}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              You scored {score} out of {total_questions} questions correctly
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
              <div 
                className={`h-4 rounded-full transition-all duration-500 ${
                  percentage >= 80 ? 'bg-green-500' : 
                  percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Question Review</h3>
          <div className="space-y-6">
            {questions?.map((question, index) => {
              const result = getQuestionResult(question.id);
              if (!result) return null;
              
              return (
                <div key={question.id} className="border-l-4 pl-4 py-2" 
                     style={{ borderColor: result.isCorrect ? '#10B981' : '#EF4444' }}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-800">
                      {index + 1}. {question.question_text}
                    </h4>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      result.isCorrect 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <div className="ml-4">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Your answer:</span> {result.selectedAnswer?.choice_letter}) {result.selectedAnswer?.choice_text}
                    </p>
                    
                    {!result.isCorrect && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Correct answer:</span> {
                          question.answers.find(a => a.is_correct)?.choice_letter
                        }) {question.answers.find(a => a.is_correct)?.choice_text}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/profile')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go to Profile
          </button>
          
          <button
            onClick={() => navigate('/documents')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Browse Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
