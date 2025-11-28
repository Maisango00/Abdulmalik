import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PublicLayout, PortalLayout } from './components/Layouts';
import { Home, Admissions } from './pages/Public';
import { AdminDashboard } from './pages/AdminPortal';
import { StudentDashboard } from './pages/StudentPortal';
import { TeacherDashboard } from './pages/TeacherPortal';
import { UserRole } from './types';
import { Button, Card, Input } from './components/UI';
import { ContentProvider } from './context/ContentContext';

// --- Login Page Component ---
const Login = ({ onLogin }: { onLogin: (role: UserRole) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, validation and API call here.
    // For prototype, we just pass the role.
    onLogin(selectedRole);
  };

  const fillDemoCredentials = (role: UserRole) => {
    setSelectedRole(role);
    if (role === UserRole.ADMIN) {
      setEmail('admin@mukl.edu');
      setPassword('admin123');
    } else if (role === UserRole.TEACHER) {
      setEmail('m.ali@mukl.edu');
      setPassword('teacher123');
    } else {
      setEmail('abdullah@student.mukl.edu');
      setPassword('student123');
    }
  };

  return (
    <div className="min-h-screen bg-islamic-cream flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-t-islamic-primary">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-islamic-primary rounded-full flex items-center justify-center text-white font-serif font-bold text-2xl mx-auto mb-4 border-4 border-islamic-gold">M</div>
          <h2 className="text-2xl font-serif font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500">Sign in to your portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Portal</label>
            <div className="grid grid-cols-3 gap-2">
              {[UserRole.STUDENT, UserRole.TEACHER, UserRole.ADMIN].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`py-2 px-1 text-xs sm:text-sm font-medium rounded border transition-all ${
                    selectedRole === role
                      ? 'bg-islamic-primary text-white border-islamic-primary'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <Input 
            label="Email Address" 
            type="email" 
            placeholder="you@mukl.edu" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex items-center justify-between text-sm">
             <label className="flex items-center">
               <input type="checkbox" className="mr-2 text-islamic-primary focus:ring-islamic-primary" />
               Remember me
             </label>
             <a href="#" className="text-islamic-primary hover:underline">Forgot password?</a>
          </div>

          <Button type="submit" className="w-full">Sign In</Button>
        </form>

        {/* Demo Credentials Section */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">Demo Login Details</p>
          <div className="space-y-2">
            <button 
              type="button"
              onClick={() => fillDemoCredentials(UserRole.ADMIN)}
              className="w-full flex justify-between items-center p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all text-left group"
            >
              <span className="text-sm font-medium text-islamic-primary group-hover:underline">Admin</span>
              <span className="text-xs text-gray-500">admin@mukl.edu</span>
            </button>
            <button 
              type="button"
              onClick={() => fillDemoCredentials(UserRole.TEACHER)}
              className="w-full flex justify-between items-center p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all text-left group"
            >
              <span className="text-sm font-medium text-islamic-primary group-hover:underline">Teacher</span>
              <span className="text-xs text-gray-500">m.ali@mukl.edu</span>
            </button>
            <button 
              type="button"
              onClick={() => fillDemoCredentials(UserRole.STUDENT)}
              className="w-full flex justify-between items-center p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-all text-left group"
            >
              <span className="text-sm font-medium text-islamic-primary group-hover:underline">Student</span>
              <span className="text-xs text-gray-500">abdullah@student.mukl.edu</span>
            </button>
          </div>
          <p className="text-[10px] text-center text-gray-400 mt-2">Click any row above to auto-fill credentials</p>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
           Not registered yet? <a href="/#/admissions" className="text-islamic-primary font-bold hover:underline">Apply for Admission</a>
        </div>
      </Card>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);

  const handleLogin = (role: UserRole) => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(UserRole.GUEST);
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: UserRole }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (requiredRole && userRole !== requiredRole) {
      // If admin, allow access to all for demo purposes, or redirect to own dashboard
      return <Navigate to={`/portal/${userRole.toLowerCase()}`} replace />;
    }
    return <>{children}</>;
  };

  return (
    <ContentProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/admissions" element={<PublicLayout><Admissions /></PublicLayout>} />
          <Route path="/login" element={
              isAuthenticated ? 
              <Navigate to={`/portal/${userRole.toLowerCase()}`} /> : 
              <Login onLogin={handleLogin} />
          } />

          {/* Protected Portal Routes */}
          <Route 
            path="/portal/admin/*" 
            element={
              <ProtectedRoute requiredRole={UserRole.ADMIN}>
                <PortalLayout role={UserRole.ADMIN} onLogout={handleLogout}>
                  <AdminDashboard />
                </PortalLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/portal/student/*" 
            element={
              <ProtectedRoute requiredRole={UserRole.STUDENT}>
                <PortalLayout role={UserRole.STUDENT} onLogout={handleLogout}>
                  <StudentDashboard />
                </PortalLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/portal/teacher/*" 
            element={
              <ProtectedRoute requiredRole={UserRole.TEACHER}>
                <PortalLayout role={UserRole.TEACHER} onLogout={handleLogout}>
                  <TeacherDashboard />
                </PortalLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ContentProvider>
  );
}

export default App;
