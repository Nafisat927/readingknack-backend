import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Upload from './pages/UploadDocument';
import DocumentsList from './pages/DocumentList';
import Quiz from './pages/Quiz';
import QuizResults from './pages/QuizResults';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import UploadDocument from './pages/UploadDocument';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<UploadDocument />} />
        <Route path="/documents" element={<DocumentsList />} />
        <Route path="/quiz/:documentId" element={<Quiz />} />
        <Route path="/quiz-results" element={<QuizResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
