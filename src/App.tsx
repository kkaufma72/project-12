import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import PrivateRoute from './components/auth/PrivateRoute';
import SignIn from './pages/SignIn';
import LandingPage from './pages/LandingPage';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import DataManagement from './pages/DataManagement';
import ModelTraining from './pages/ModelTraining';
import ModelEvaluation from './pages/ModelEvaluation';
import Deployment from './pages/Deployment';
import Documentation from './pages/Documentation';
import { MLProvider } from './context/MLContext';

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/app/*"
        element={
          <PrivateRoute>
            <div className="flex h-screen overflow-hidden bg-gray-50">
              <Sidebar />
              <div className="flex flex-col flex-1 w-0 overflow-hidden">
                <Navbar />
                <main className="relative flex-1 overflow-y-auto focus:outline-none">
                  <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 md:px-8">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/data" element={<DataManagement />} />
                      <Route path="/train" element={<ModelTraining />} />
                      <Route path="/evaluate" element={<ModelEvaluation />} />
                      <Route path="/deploy" element={<Deployment />} />
                      <Route path="/documentation" element={<Documentation />} />
                      <Route path="*" element={<Navigate to="/app" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <MLProvider>
        <Router>
          <AppContent />
        </Router>
      </MLProvider>
    </AuthProvider>
  );
}

export default App;