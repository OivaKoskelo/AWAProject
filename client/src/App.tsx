import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import BoardPage from './pages/Board';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
          <Route path='/board' element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
          <Route path='*' element={<Navigate to='/board' />} />
        </Routes>
      </Router>
    </>
  );
};

export default App
