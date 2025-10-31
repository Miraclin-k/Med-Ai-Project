import React, { useState } from 'react';
import { Patient } from '../types';
import UserIcon from './icons/UserIcon';

interface PatientListProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
  onRegisterClick: () => void;
}

const PatientList: React.FC<PatientListProps> = ({ patients, selectedPatient, onSelectPatient, onRegisterClick }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.uid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-full md:w-1/3 max-w-sm bg-white border-r border-gray-200 flex flex-col h-full rounded-l-lg">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-700">Patients</h2>
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <nav className="flex-1 overflow-y-auto">
        {filteredPatients.length > 0 ? (
          <ul>
            {filteredPatients.map(patient => (
              <li key={patient.uid}>
                <button
                  onClick={() => onSelectPatient(patient)}
                  className={`w-full text-left p-4 flex items-center gap-4 transition-colors duration-200 ${
                    selectedPatient?.uid === patient.uid
                      ? 'bg-blue-100 text-blue-700 border-r-4 border-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="bg-gray-200 rounded-full p-2">
                      <UserIcon className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold">{patient.name}</p>
                    <p className="text-sm text-gray-500">ID: {patient.uid}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-4 text-center text-gray-500">No patients found.</p>
        )}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={onRegisterClick}
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Register New Patient
        </button>
      </div>
    </aside>
  );
};

export default PatientList;
