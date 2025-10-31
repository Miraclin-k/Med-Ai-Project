import React from 'react';
import { Patient, PatientRecord } from '../../types';
import ReportAnalysis from '../ReportAnalysis';

interface ReportAnalysisPageProps {
  patient: Patient | null; // Allow null for guest users
  addPatientRecord: (patientId: string, record: PatientRecord) => void;
}

const ReportAnalysisPage: React.FC<ReportAnalysisPageProps> = ({ patient, addPatientRecord }) => {
  return (
    <div className="max-w-4xl mx-auto">
       <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">AI Report & Image Analysis</h1>
          <p className="text-lg text-gray-500 mt-1">Upload your medical documents for an instant, AI-powered summary and analysis.</p>
      </header>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        {patient ? (
          <ReportAnalysis patient={patient} addPatientRecord={addPatientRecord} />
        ) : (
          <div className="text-center p-8 bg-yellow-50 border-l-4 border-yellow-500">
            <h3 className="font-bold text-yellow-800">Please Log In</h3>
            <p className="text-yellow-700">You must be logged in as a patient to save analysis results to your record.</p>
            {/* In a real app, this would be a login button */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportAnalysisPage;
