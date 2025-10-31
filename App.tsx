
import React, { useState, useEffect } from 'react';
import { PatientRecord, Department, UserProfile } from './types';
import { auth, db } from './services/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import Chatbot from './components/Chatbot';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import DoctorPortal from './components/pages/DoctorPortal';
import AnalyticsDashboard from './components/pages/AnalyticsDashboard';
import DoctorsPage from './components/pages/DoctorsPage';
import AppointmentBooking from './components/pages/AppointmentBooking';
import ReportAnalysisPage from './components/pages/ReportAnalysisPage';
import Dashboard from './components/Dashboard';
import ArrowLeftIcon from './components/icons/ArrowLeftIcon';
import LoginPage from './components/pages/LoginPage';
import DoctorSpecializationPage from './components/pages/DoctorSpecializationPage';
import SignUpPage from './components/pages/SignUpPage';

export type View = 'login' | 'signup' | 'home' | 'doctors' | 'booking' | 'analysis' | 'analytics' | 'doctorPortal' | 'patientPortal' | 'doctorSpecialization';

const App: React.FC = () => {
  const [view, setView] = useState<View>('login');
  const [history, setHistory] = useState<View[]>(['login']);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorSpecialization, setDoctorSpecialization] = useState<Department | null>(null);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Fetch user role and profile from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const profileDocRef = doc(db, userData.role === 'doctor' ? 'doctors' : 'patients', user.uid);
          const profileDocSnap = await getDoc(profileDocRef);
          
          if (profileDocSnap.exists()) {
            const profileData = { uid: user.uid, ...profileDocSnap.data() } as UserProfile;
            profileData.role = userData.role;
            setUserProfile(profileData);
            
            if (profileData.role === 'doctor') {
              navigateTo('doctorSpecialization', { reset: true });
            } else {
              navigateTo('patientPortal', { reset: true });
            }
          } else {
            console.error("No profile found for user");
            await signOut(auth); // Log out if profile is missing
          }
        } else {
            console.error("No user role document found");
            await signOut(auth); // Log out if role doc is missing
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        navigateTo('login', { reset: true });
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const navigateTo = (newView: View, options?: { reset?: boolean }) => {
    if (options?.reset) {
        setHistory([newView]);
    } else {
        if (history[history.length - 1] === newView) return;
        setHistory(prev => [...prev, newView]);
    }
    setView(newView);
  };

  const goBack = () => {
    if (history.length <= 1) return;
    const newHistory = [...history];
    newHistory.pop();
    setHistory(newHistory);
    setView(newHistory[newHistory.length - 1]);
  };
  
  const handleSelectSpecialization = (department: Department) => {
    setDoctorSpecialization(department);
    navigateTo('doctorPortal');
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
        setDoctorSpecialization(null);
        setLoginMessage(null);
        navigateTo('login', { reset: true });
    } catch (error) {
        console.error("Error signing out:", error);
    }
  };
  
  const addPatientRecord = (patientId: string, record: PatientRecord) => {
    // This function will now be handled directly in components using Firestore
    // For now, we update the local state if the user profile is a patient
    if (userProfile?.role === 'patient' && userProfile.uid === patientId) {
        setUserProfile({
            ...userProfile,
            records: [...userProfile.records, record],
        });
    }
  };
  
  const renderView = () => {
    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><p>Loading application...</p></div>;
    }
      
    if (['analytics', 'doctorPortal', 'doctorSpecialization'].includes(view) && userProfile?.role !== 'doctor') {
        return <HomePage setView={navigateTo} />;
    }
    if (view === 'patientPortal' && (userProfile?.role !== 'patient')) {
        return <HomePage setView={navigateTo} />;
    }

    switch(view) {
      case 'login':
      case 'signup':
        return null; // Handled by main conditional render
      case 'home':
        return <HomePage setView={navigateTo} />;
      case 'doctors':
        return <DoctorsPage setView={navigateTo} />;
      case 'booking':
        return <AppointmentBooking />;
      case 'analysis':
        return <ReportAnalysisPage patient={userProfile?.role === 'patient' ? userProfile : null} addPatientRecord={addPatientRecord} />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'doctorSpecialization':
        return <DoctorSpecializationPage onSelect={handleSelectSpecialization} />;
      case 'doctorPortal':
        return <DoctorPortal specialization={doctorSpecialization} />;
      case 'patientPortal':
        if(userProfile?.role === 'patient') {
            return <div className="p-8"><Dashboard patient={userProfile} addPatientRecord={addPatientRecord} /></div>;
        }
        return <HomePage setView={navigateTo} />;
      default:
        return <HomePage setView={navigateTo} />;
    }
  }

  if (isLoading) {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <p className="text-xl font-semibold">Loading MedAI+...</p>
        </div>
    );
  }

  if (!currentUser) {
    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
            {view === 'login' && <LoginPage setView={navigateTo} message={loginMessage} setLoginMessage={setLoginMessage} />}
            {view === 'signup' && <SignUpPage setView={navigateTo} setLoginMessage={setLoginMessage} />}
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 bg-gray-50">
      <Header setView={navigateTo} userRole={userProfile?.role || null} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {history.length > 1 && (
          <button
            onClick={goBack}
            className="flex items-center gap-2 mb-6 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Go back to previous page"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
        )}
        {renderView()}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default App;
