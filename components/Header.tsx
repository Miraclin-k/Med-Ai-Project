import React from 'react';
// Fix: UserRole is not exported from App.tsx, so it is imported from types.ts instead.
import { View } from '../App';
import { UserRole } from '../types';
import HomeIcon from './icons/HomeIcon';
import StethoscopeIcon from './icons/StethoscopeIcon';
import CalendarIcon from './icons/CalendarIcon';
import FileIcon from './icons/FileIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import UserIcon from './icons/UserIcon';

interface HeaderProps {
  setView: (view: View, options?: { reset?: boolean }) => void;
  userRole: UserRole | null;
  onLogout: () => void;
}

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode; }> = ({ onClick, children }) => (
  <button onClick={onClick} className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200">
    {children}
  </button>
);

const Header: React.FC<HeaderProps> = ({ setView, userRole, onLogout }) => {

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 19L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 12L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M5 12L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 12C12 12 12 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={() => setView('home', { reset: true })}>MedAI+</h1>
          </div>
          <nav className="hidden lg:flex items-center gap-2 font-semibold">
            <NavLink onClick={() => setView('home', { reset: true })}><HomeIcon className="w-5 h-5" /> Home</NavLink>
            <NavLink onClick={() => setView('doctors')}><StethoscopeIcon className="w-5 h-5" /> Doctors</NavLink>
            <NavLink onClick={() => setView('booking')}><CalendarIcon className="w-5 h-5" /> Book Appointment</NavLink>
            <NavLink onClick={() => setView('analysis')}><FileIcon className="w-5 h-5" /> Report Analysis</NavLink>
            {userRole === 'doctor' && (
              <NavLink onClick={() => setView('analytics')}><ChartBarIcon className="w-5 h-5" /> Analytics</NavLink>
            )}
          </nav>
          <div className="flex items-center gap-4">
             {userRole ? (
                <>
                    <button 
                        onClick={() => setView(userRole === 'doctor' ? 'doctorPortal' : 'patientPortal', { reset: true })} 
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-blue-600 font-semibold border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                    >
                        <UserIcon className="w-5 h-5" />
                        My Dashboard
                    </button>
                    <button 
                        onClick={onLogout} 
                        className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Logout
                    </button>
                </>
             ) : (
                <button 
                    onClick={() => setView('login', { reset: true })} 
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                    Login / Sign Up
                </button>
             )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;