
import React, { useState } from 'react';
import { Patient, PatientRecord } from '../types';
import PatientOverview from './PatientOverview';
import VoiceDictation from './VoiceDictation';
import ReportAnalysis from './ReportAnalysis';
import AiSuggestions from './AiSuggestions';
import UserIcon from './icons/UserIcon';
import FileIcon from './icons/FileIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import BrainCircuitIcon from './icons/BrainCircuitIcon';

interface DashboardProps {
  patient: Patient;
  addPatientRecord: (patientId: string, record: PatientRecord) => void;
}

type Tab = 'overview' | 'notes' | 'reports' | 'ai';

const Dashboard: React.FC<DashboardProps> = ({ patient, addPatientRecord }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'notes', label: 'Voice Notes', icon: MicrophoneIcon },
    { id: 'reports', label: 'Reports & Images', icon: FileIcon },
    { id: 'ai', label: 'AI Suggestions', icon: BrainCircuitIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <PatientOverview patient={patient} />;
      case 'notes':
        return <VoiceDictation patient={patient} addPatientRecord={addPatientRecord} />;
      case 'reports':
        return <ReportAnalysis patient={patient} addPatientRecord={addPatientRecord} />;
      case 'ai':
        return <AiSuggestions patient={patient} addPatientRecord={addPatientRecord} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <header className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-3xl font-bold">{patient.name}</h2>
        <div className="flex space-x-6 text-gray-600 mt-2">
          <span>ID: {patient.uid}</span>
          <span>Age: {patient.age}</span>
          <span>Gender: {patient.gender}</span>
        </div>
      </header>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-2 p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
