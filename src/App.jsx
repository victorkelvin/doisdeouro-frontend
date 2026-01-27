import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Main from './pages/Main';
import AlunoRegister from './pages/AlunoRegister';
import { validateRegistrationToken } from './services/alunosApi';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const ValidateTokenRoute = ({ children }) => {
  const { token } = useParams();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await validateRegistrationToken(token);
        setIsValid(response.is_valid);
      } catch (error) {
        setIsValid(false);
      }
    };

    validateToken();
  }, [token]);

  return isValid ? children : <div>Token inválido ou expirado.</div>;


}

// App with AuthProvider
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register/:token" element={
            <ValidateTokenRoute>
              <AlunoRegister />
            </ValidateTokenRoute>
          } />
          <Route path="/main/*" element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/main/aulas" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;