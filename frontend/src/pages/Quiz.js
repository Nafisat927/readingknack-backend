import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { documentsAPI, quizAPI } from '../api';
import './Quiz.css';

  const Quiz = () => {
  // Toggle this to switch between mock and real data
  const USE_MOCK_DATA = false; // Set to false when ready for backend

  const { documentId } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Mock data functions
  const getMockDocument = () => {
  return Promise.resolve({
  data: {
  id: 1,
  title: "The Solar System",
  content: `A passage about planets, stars, and space...`
  }
  });
  };

  const getMockQuestions = () => {
  return Promise.resolve({
  data: {
  questions: [
  {
  id: 1,
  question_text: "How many planets are in our solar system?",
  answers: [
  { id: 1, choice_letter: "A", choice_text: "7 planets" },
  { id: 2, choice_letter: "B", choice_text: "8 planets" },
  { id: 3, choice_letter: "C", choice_text: "9 planets" },
  { id: 4, choice_letter: "D", choice_text: "10 planets" }
  ]
  },
  {
  id: 2,
  question_text: "Which planet is closest to the Sun?",
  answers: [
  { id: 5, choice_letter: "A", choice_text: "Venus" },
  { id: 6, choice_letter: "B", choice_text: "Mercury" },
  { id: 7, choice_letter: "C", choice_text: "Earth" },
  { id: 8, choice_letter: "D", choice_text: "Mars" }
  ]
  },
  {
  id: 3,
  question_text: "What is the largest planet in our solar system?",
  answers: [
  { id: 9, choice_letter: "A", choice_text: "Saturn" },
  { id: 10, choice_letter: "B", choice_text: "Jupiter" },
  { id: 11, choice_letter: "C", choice_text: "Neptune" },
  { id: 12, choice_letter: "D", choice_text: "Uranus" }
  ]
  },
  {
  id: 4,
  question_text: "Which planet is known as the 'Red Planet'?",
  answers: [
  { id: 13, choice_letter: "A", choice_text: "Venus" },
  { id: 14, choice_letter: "B", choice_text: "Jupiter" },
  { id: 15, choice_letter: "C", choice_text: "Mars" },
  { id: 16, choice_letter: "D", choice_text: "Saturn" }
  ]
  },
  {
  id: 5,
  question_text: "What force keeps planets in orbit around the Sun?",
  answers: [
  { id: 17, choice_letter: "A", choice_text: "Magnetism" },
  { id: 18, choice_letter: "B", choice_text: "Gravity" },
  { id: 19, choice_letter: "C", choice_text: "Centrifugal force" },
  { id: 20, choice_letter: "D", choice_text: "Solar wind" }
  ]
  }
  ]
  }
  });
  };

  const fetchQuizData = useCallback(async () => {
  try {
  setLoading(true);
  
  let documentRes, questionsRes;
  
  if (USE_MOCK_DATA) {
  // Use mock data
  [documentRes, questionsRes] = await Promise.all([
  getMockDocument(),
  getMockQuestions()
  ]);
  } else {
  // Use real API calls - getDetail includes both document info and questions
  const detailRes = await documentsAPI.getDetail(documentId);
  documentRes = { data: detailRes.data };
  questionsRes = { data: { questions: detailRes.data.questions || [] } };
  }
  
  setDocument(documentRes.data);
  setQuestions(questionsRes.data.questions || []);
  } catch (err) {
  setError('Failed to load quiz');
  console.error('Error fetching quiz data:', err);
  } finally {
  setLoading(false);
  }
  }, [documentId, USE_MOCK_DATA]);

  useEffect(() => {
  fetchQuizData();
  }, [fetchQuizData]);

  const handleAnswerSelect = (questionId, answerId) => {
  setAnswers(prev => ({
  ...prev,
  [questionId]: answerId
  }));
  };

  const handleSubmit = async () => {
  const unansweredQuestions = questions.filter(q => !answers[q.id]);
  if (unansweredQuestions.length > 0) {
  setError(`Please answer all questions. You have ${unansweredQuestions.length} unanswered question(s).`);
  return;
  }

  setSubmitting(true);
  setError('');

  try {
  const answersArray = Object.entries(answers).map(([questionId, answerId]) => ({
  question_id: parseInt(questionId),
  selected_answer_id: parseInt(answerId)
  }));

  let response;
  
  if (USE_MOCK_DATA) {
  // Mock submission with correct answers for scoring
  const correctAnswers = {
  1: 2, // 8 planets
  2: 6, // Mercury
  3: 10, // Jupiter
  4: 15, // Mars
  5: 18 // Gravity
  };
  
  let score = 0;
  Object.entries(answers).forEach(([questionId, answerId]) => {
  if (correctAnswers[parseInt(questionId)] === parseInt(answerId)) {
  score++;
  }
  });

  response = await new Promise(resolve => {
  setTimeout(() => {
  resolve({
  data: {
  score: score,
  total: questions.length,
  }
  });
  }, 1000);
  });
  
  // For mock data, show completion screen
  setSubmitted(true);
  
  } else {
  // Real API submission
  response = await quizAPI.submit({
  document_id: parseInt(documentId),
  user_name: 'Anonymous', // You can add a username input field later
  answers: answersArray
  });

  // Navigate to quiz results page with quiz data
  navigate('/quiz-results', {
  state: {
  quizResult: response.data,
  document: document,
  questions: questions,
  userAnswers: answers
  }
  });
  }

  } catch (err) {
  setError(err.response?.data?.error || 'Failed to submit quiz');
  } finally {
  setSubmitting(false);
  }
  };

  const handleReset = () => {
  setAnswers({});
  //setUsername('');
  setCurrentQuestion(0);
  setSubmitted(false);
  setError(null);
  };

  // Show completion screen for mock data
  if (submitted && USE_MOCK_DATA) {
  const correctAnswers = {
  1: 2, 2: 6, 3: 10, 4: 15, 5: 18
  };
  
  let score = 0;
  Object.entries(answers).forEach(([questionId, answerId]) => {
  if (correctAnswers[parseInt(questionId)] === parseInt(answerId)) {
  score++;
  }
  });

  return (
  <div className="quiz-container">
  <div className="text-center py-12">
  <div className="text-green-600 text-6xl mb-4">✓</div>
  <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed!</h2>
  <p className="text-gray-600 mb-4">
  Great job! Your quiz has been submitted successfully.
  </p>
  <div className="text-2xl font-bold text-blue-600 mb-6">
  Your Score: {score}/{questions.length} ({Math.round((score/questions.length) * 100)}%)
  </div>
  <div className="space-y-4">
  <button
  onClick={handleReset}
  className="submit-button mr-4"
  >
  Take Quiz Again
  </button>
  <button
  onClick={() => navigate(`/documents/${documentId || ''}`)}
  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
  >
  Back to Document
  </button>
  </div>
  </div>
  </div>
  );
  }

  if (loading) {
  return (
  <div className="quiz-container">
  <div className="flex justify-center items-center h-64">
  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
  </div>
  );
  }

  if (error && !document) {
  return (
  <div className="quiz-container">
  <div className="text-center py-12">
  <div className="text-red-600 mb-4">{error}</div>
  <button 
  onClick={fetchQuizData}
  className="submit-button"
  >
  Try Again
  </button>
  </div>
  </div>
  );
  }

  if (!questions || questions.length === 0) {
  return (
  <div className="quiz-container">
  <div className="text-center py-12">
  <h2 className="text-2xl font-bold text-gray-800 mb-2">No Quiz Available</h2>
  <p className="text-gray-600 mb-6">
  This passage doesn't have any quiz questions yet.
  </p>
  <button
  onClick={() => navigate(`/documents/${documentId}`)}
  className="submit-button"
  >
  Back to Passage
  </button>
  </div>
  </div>
  );
  }

  const currentQ = questions[currentQuestion];
  const passageText = document?.parsed_text || document?.content || document?.text || '';

  return (
  <div className="quiz-container">


  {/* Main Content - Two Column Layout */}
  <div className="quiz-layout">
  {/* Left Column - Passage */}
  <div className="passage-section">
  <h2 className="passage-title">{document?.title || "Passage Title"}</h2>
  <div className="passage-box">
  {passageText || "Passage"}
  </div>
  </div>

  {/* Right Column - Questions */}
  <div className="questions-section">
  <h2 className="questions-title">Comprehension Questions</h2>
  
  <div className="question-item">
  <div className="question-number">
  {currentQuestion + 1}. {currentQ.question_text}
  </div>
  
  <div className="answer-options">
  {currentQ.answers?.map((answer) => (
  <label
  key={answer.id}
  className={`answer-option ${answers[currentQ.id] === answer.id ? 'selected' : ''}`}
  >
  <input
  type="radio"
  name={`question-${currentQ.id}`}
  value={answer.id}
  checked={answers[currentQ.id] === answer.id}
  onChange={() => handleAnswerSelect(currentQ.id, answer.id)}
  className="sr-only"
  />
  <div className="answer-letter">{answer.choice_letter}</div>
  <div className="answer-text">{answer.choice_text}</div>
  </label>
  ))}
  </div>
  </div>

  {/* Submit Button */}
  <button
  onClick={() => {
  if (currentQuestion < questions.length - 1) {
  setCurrentQuestion(prev => prev + 1);
  } else {
  handleSubmit();
  }
  }}
  disabled={submitting}
  className="submit-button"
  >
  {submitting ? 'Submitting...' : currentQuestion < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
  </button>
  </div>
  </div>

  {/* Error Message */}
  {error && (
  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
  <p className="text-red-700">{error}</p>
  </div>
  )}
  </div>
  );
  };

export default Quiz;
