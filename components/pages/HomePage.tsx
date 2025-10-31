
import React from 'react';
import { View } from '../../App';
import StethoscopeIcon from '../icons/StethoscopeIcon';
import CalendarIcon from '../icons/CalendarIcon';
import FileIcon from '../icons/FileIcon';

interface HomePageProps {
  setView: (view: View, options?: { reset?: boolean }) => void;
}

const ServiceCard: React.FC<{ icon: React.ReactNode; title: string; description: string; onClick: () => void; }> = ({ icon, title, description, onClick }) => (
    <div 
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
        <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ setView }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center bg-white p-12 rounded-xl shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-600">Advanced Care, Powered by Piexl Pairs</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Welcome to MedAI+, where cutting-edge technology meets compassionate healthcare. Access your records, find doctors, and get AI-driven insights instantly.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={() => setView('booking')}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Book an Appointment
          </button>
          <button 
            onClick={() => setView('analysis')}
            className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-transform transform hover:scale-105"
          >
            Analyze a Report
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
                icon={<StethoscopeIcon className="w-6 h-6" />}
                title="Find a Doctor"
                description="Search our directory of world-class specialists and find the right care for you."
                onClick={() => setView('doctors')}
            />
            <ServiceCard 
                icon={<CalendarIcon className="w-6 h-6" />}
                title="Schedule an Appointment"
                description="Easily book, reschedule, or manage your appointments online with our intuitive system."
                onClick={() => setView('booking')}
            />
            <ServiceCard 
                icon={<FileIcon className="w-6 h-6" />}
                title="AI Report Analysis"
                description="Upload your medical reports and images to get instant, AI-powered analysis and insights."
                onClick={() => setView('analysis')}
            />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
