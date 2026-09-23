import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Target, 
  Briefcase, 
  Map, 
  GraduationCap, 
  User, 
  LogOut,
  Building,
  Users,
  BookOpen,
  FileText,
  Megaphone,
  Globe,
  Microscope,
  Handshake,
  Calendar
} from 'lucide-react';

export function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const role = user?.role || 'STUDENT';

  const getLinks = () => {
    if (role === 'STUDENT') {
      return [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        { name: 'Skill Assessment', to: '/assessment', icon: Target },
        { name: 'Learning Hub', to: '/courses', icon: BookOpen },
        { name: 'Industry Programs', to: '/programs', icon: GraduationCap },
        { name: 'Assignments', to: '/assignments', icon: FileText },
        { name: 'Career Roadmap', to: '/roadmap', icon: Map },
        { name: 'Jobs & Internships', to: '/jobs', icon: Briefcase },
        { name: 'Profile', to: '/profile', icon: User },
      ];
    }
    if (role === 'RECRUITER') {
      return [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        { name: 'Job Posts', to: '/recruiter/jobs', icon: Briefcase },
        { name: 'Applications', to: '/recruiter/applications', icon: FileText },
        { name: 'AI Candidate Matching', to: '/recruiter/matching', icon: Users },
        { name: 'Interviews', to: '/recruiter/interviews', icon: Calendar },
        { name: 'Industry Learning Programs', to: '/recruiter/programs', icon: GraduationCap },
        { name: 'Company Profile', to: '/recruiter/profile', icon: Building },
      ];
    }
    if (role === 'TEACHER') {
      return [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        { name: 'My Courses', to: '/teacher/courses', icon: BookOpen },
        { name: 'Students', to: '/teacher/students', icon: Users },
        { name: 'Assignments', to: '/teacher/assignments', icon: FileText },
        { name: 'Announcements', to: '/teacher/announcements', icon: Megaphone },
        { name: 'Faculty Opportunities', to: '/teacher/opportunities', icon: Globe },
        { name: 'Industry Programs', to: '/programs', icon: Building },
        { name: 'FDP & Training', to: '/teacher/fdp', icon: GraduationCap },
        { name: 'Consultancy', to: '/teacher/consultancy', icon: Briefcase },
        { name: 'Research Collaboration', to: '/teacher/research', icon: Microscope },
        { name: 'Industry Mentorship', to: '/teacher/mentorship', icon: Handshake },
      ];
    }

    return [];
  };

  const links = getLinks();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-800 bg-gray-950">
          <GraduationCap className="h-8 w-8 text-indigo-500 mr-2" />
          <span className="text-xl font-bold text-white tracking-wide">
            SkillBridge
          </span>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <link.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <div className="flex items-center mb-4 px-3">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
              {user?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
              <p className="text-xs text-gray-400 capitalize">{role.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center bg-red-600 px-3 py-2 text-sm font-medium text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (simplified for now) */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center">
            <GraduationCap className="h-6 w-6 text-indigo-600 mr-2" />
            <span className="text-lg font-bold">SkillBridge</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
