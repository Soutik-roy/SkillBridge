import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

// Layout
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages - Public & Auth
import Landing from './pages/public/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages - Student
import StudentDashboard from './pages/student/Dashboard';
import Assessment from './pages/student/Assessment';
import Roadmap from './pages/student/Roadmap';
import Jobs from './pages/student/Jobs';
import Profile from './pages/student/Profile';
import Courses from './pages/student/Courses';
import CourseViewer from './pages/student/CourseViewer';
import StudentAssignments from './pages/student/Assignments';
import IndustryProgramsList from './pages/public/IndustryProgramsList';

// Pages - Recruiter
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterJobs from './pages/recruiter/Jobs';
import RecruiterApplications from './pages/recruiter/Applications';
import RecruiterProfile from './pages/recruiter/Profile';
import RecruiterMatches from './pages/recruiter/Matches';
import RecruiterInterviews from './pages/recruiter/Interviews';
import RecruiterPrograms from './pages/recruiter/Programs';

// Pages - Institution
import InstitutionAnalytics from './pages/institution/Analytics';

import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherOpportunities from './pages/teacher/Opportunities';
import TeacherStudents from './pages/teacher/Students';
import TeacherCourses from './pages/teacher/Courses';
import TeacherAnnouncements from './pages/teacher/Announcements';
import TeacherAssignments from './pages/teacher/Assignments';


const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-full">
    <h1 className="text-2xl font-bold text-gray-500">{title} (Coming Soon)</h1>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
  }
  
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  
  return <DashboardLayout>{children}</DashboardLayout>;
};

// Route director based on role
const DashboardDirector = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'STUDENT') return <StudentDashboard />;
  if (user.role === 'RECRUITER') return <RecruiterDashboard />;
  if (user.role === 'TEACHER') return <TeacherDashboard />;

  return <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardDirector /></ProtectedRoute>} />
          
          {/* Student */}
          <Route path="/assessment" element={<ProtectedRoute allowedRoles={['STUDENT']}><Assessment /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute allowedRoles={['STUDENT']}><Roadmap /></ProtectedRoute>} />
          <Route path="/jobs" element={<ProtectedRoute allowedRoles={['STUDENT']}><Jobs /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['STUDENT']}><Profile /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute allowedRoles={['STUDENT']}><Courses /></ProtectedRoute>} />
          <Route path="/courses/:courseId" element={<ProtectedRoute allowedRoles={['STUDENT']}><CourseViewer /></ProtectedRoute>} />
          <Route path="/assignments" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentAssignments /></ProtectedRoute>} />
          <Route path="/programs" element={<ProtectedRoute allowedRoles={['STUDENT', 'TEACHER']}><IndustryProgramsList /></ProtectedRoute>} />
          
          {/* Recruiter */}
          <Route path="/recruiter/jobs" element={<ProtectedRoute allowedRoles={['RECRUITER']}><RecruiterJobs /></ProtectedRoute>} />
          <Route path="/recruiter/applications" element={<ProtectedRoute allowedRoles={['RECRUITER']}><RecruiterApplications /></ProtectedRoute>} />
          <Route path="/recruiter/matching" element={<ProtectedRoute allowedRoles={['RECRUITER']}><RecruiterMatches /></ProtectedRoute>} />
          <Route path="/recruiter/interviews" element={<ProtectedRoute allowedRoles={['RECRUITER']}><RecruiterInterviews /></ProtectedRoute>} />
          <Route path="/recruiter/programs" element={<ProtectedRoute allowedRoles={['RECRUITER']}><RecruiterPrograms /></ProtectedRoute>} />
          <Route path="/recruiter/profile" element={<ProtectedRoute allowedRoles={['RECRUITER']}><RecruiterProfile /></ProtectedRoute>} />

          {/* Teacher */}
          <Route path="/teacher/analytics" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/courses" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherCourses /></ProtectedRoute>} />
          <Route path="/teacher/students" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherStudents /></ProtectedRoute>} />
          <Route path="/teacher/assignments" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherAssignments /></ProtectedRoute>} />
          <Route path="/teacher/announcements" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherAnnouncements /></ProtectedRoute>} />
          <Route path="/teacher/opportunities" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherOpportunities /></ProtectedRoute>} />
          <Route path="/teacher/fdp" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherOpportunities defaultFilter="FDP" /></ProtectedRoute>} />
          <Route path="/teacher/consultancy" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherOpportunities defaultFilter="Consultancy" /></ProtectedRoute>} />
          <Route path="/teacher/research" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherOpportunities defaultFilter="Research" /></ProtectedRoute>} />
          <Route path="/teacher/mentorship" element={<ProtectedRoute allowedRoles={['TEACHER']}><TeacherOpportunities defaultFilter="Mentorship" /></ProtectedRoute>} />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
