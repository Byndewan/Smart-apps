// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import PlanDetail from './components/PlanDetail';
import PlanForm from './components/PlanForm';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <div className="romantic-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/plan/:id" element={
              <PrivateRoute>
                <Layout>
                  <PlanDetail />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/plan/new" element={
              <PrivateRoute>
                <Layout>
                  <PlanForm />
                </Layout>
              </PrivateRoute>
            } />
            <Route path="/plan/edit/:id" element={
              <PrivateRoute>
                <Layout>
                  <PlanForm />
                </Layout>
              </PrivateRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;