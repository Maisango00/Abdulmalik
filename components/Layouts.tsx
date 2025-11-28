import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Using HashRouter in App, so this is safe
import { Menu, X, Bell, User, Search, LogOut, LayoutDashboard, Users, BookOpen, FileText, Settings, CreditCard } from 'lucide-react';
import { NAV_LINKS, MOCK_ADMIN, MOCK_STUDENT, MOCK_TEACHER } from '../constants';
import { UserRole } from '../types';
import { Button } from './UI';

// --- Public Layout ---
export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-islamic-cream">
      {/* Top Bar */}
      <div className="bg-islamic-dark text-white py-1 px-4 text-xs md:text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <span>Madrasatu Umar Bn Khaddab Litahfidhul Qur'anil Kareem</span>
          <div className="flex space-x-4">
            <span className="cursor-pointer hover:text-islamic-gold">Arabic</span>
            <span>|</span>
            <span className="font-bold text-islamic-gold">English</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-3">
                <div className="w-10 h-10 bg-islamic-primary rounded-full flex items-center justify-center text-white font-bold text-xl font-serif border-2 border-islamic-gold">
                  M
                </div>
                <span className="font-serif text-2xl font-bold text-islamic-primary hidden md:block">
                  Madrasatu Umar
                </span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-gray-700 hover:text-islamic-primary font-medium transition-colors ${location.pathname === link.path ? 'text-islamic-primary font-bold' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
              <Link to="/login">
                <Button variant="primary" size="sm">Login Portal</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-islamic-primary focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-islamic-primary hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 pb-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Login Portal</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-islamic-dark text-white pt-12 pb-6">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
             <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-islamic-primary font-bold font-serif">M</div>
                <span className="font-serif text-xl font-bold">Madrasatu Umar</span>
             </div>
             <p className="text-gray-300 text-sm leading-relaxed">
               Nurturing the next generation of Huffaz with excellence in character and academic achievement.
             </p>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-islamic-gold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/admissions" className="hover:text-white">Admissions</Link></li>
              <li><Link to="/#about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/portal/student" className="hover:text-white">Student Portal</Link></li>
              <li><Link to="/portal/admin" className="hover:text-white">Admin Login</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="font-serif text-lg font-bold text-islamic-gold mb-4">Contact</h3>
             <ul className="space-y-2 text-sm text-gray-300">
               <li>123 Quranic Avenue</li>
               <li>Islamic District, City</li>
               <li>Phone: +123 456 7890</li>
               <li>Email: info@mukl.edu</li>
             </ul>
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-islamic-gold mb-4">Newsletter</h3>
            <div className="flex flex-col gap-2">
              <input type="email" placeholder="Your email" className="px-3 py-2 rounded text-gray-900 text-sm focus:outline-none" />
              <button className="bg-islamic-gold hover:bg-islamic-accent text-white px-3 py-2 rounded text-sm font-medium transition-colors">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Madrasatu Umar Bn Khaddab. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

// --- Portal Layout ---
interface PortalLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children, role, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Determine user data based on role
  const user = role === UserRole.ADMIN ? MOCK_ADMIN : role === UserRole.TEACHER ? MOCK_TEACHER : MOCK_STUDENT;

  const menuItems = {
    [UserRole.ADMIN]: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/portal/admin' },
      { icon: Users, label: 'Students', path: '#' },
      { icon: Users, label: 'Staff', path: '#' },
      { icon: FileText, label: 'Admissions', path: '#' },
      { icon: CreditCard, label: 'Finance', path: '#' },
      { icon: Settings, label: 'System Settings', path: '#' },
    ],
    [UserRole.TEACHER]: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/portal/teacher' },
      { icon: Users, label: 'My Classes', path: '#' },
      { icon: BookOpen, label: 'Gradebook', path: '#' },
      { icon: FileText, label: 'Reports', path: '#' },
    ],
    [UserRole.STUDENT]: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/portal/student' },
      { icon: BookOpen, label: 'My Courses', path: '#' },
      { icon: FileText, label: 'Results', path: '#' },
      { icon: CreditCard, label: 'Fees', path: '#' },
    ],
    [UserRole.GUEST]: []
  };

  const currentMenu = menuItems[role] || [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`bg-islamic-primary text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} fixed h-full z-30 hidden md:flex flex-col`}>
        <div className="h-16 flex items-center justify-center border-b border-islamic-dark">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-islamic-primary font-bold font-serif">M</div>
            {sidebarOpen && <span className="font-serif font-bold text-lg">MUKL Portal</span>}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {currentMenu.map((item) => (
              <Link key={item.label} to={item.path} className="flex items-center px-4 py-3 text-gray-100 hover:bg-islamic-light rounded-md transition-colors group">
                <item.icon size={20} className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-islamic-dark">
          <button onClick={onLogout} className="w-full flex items-center px-4 py-2 text-red-200 hover:bg-islamic-dark rounded-md transition-colors text-left">
            <LogOut size={20} className={`${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'} transition-all duration-300`}>
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-islamic-primary hidden md:block">
            <Menu size={24} />
          </button>
          <div className="md:hidden flex items-center gap-2 text-islamic-primary font-bold font-serif">
             MUKL Portal
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-1.5 border rounded-full text-sm focus:ring-islamic-primary focus:border-islamic-primary hidden sm:block w-64" />
              <Search className="absolute left-3 top-2 text-gray-400 hidden sm:block" size={16} />
            </div>
            <button className="relative text-gray-500 hover:text-islamic-primary">
              <Bell size={20} />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="flex items-center gap-2 pl-4 border-l">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-medium text-gray-700">{user.name}</p>
                 <p className="text-xs text-gray-500 capitalize">{role.toLowerCase()}</p>
               </div>
               <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden">
                 <img src={user.avatar} alt="User" className="h-full w-full object-cover" />
               </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};