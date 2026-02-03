
import React, { useState } from 'react';
import LoginPage from './my_component/LoginPage';
import SignupPage from './my_component/SignupPage';
import Roipredictionpage from './my_component/Roipredictionpage';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('prediction');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setCurrentPage('prediction');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin}
          onSwitchToSignup={() => setCurrentPage('signup')}
        />
      )}
      
      {currentPage === 'signup' && (
        <SignupPage 
          onSignup={handleSignup}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      )}
      
      {currentPage === 'prediction' && user && (
        <Roipredictionpage 
          user={user}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
