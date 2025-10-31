
import React from 'react';
import { Patient, PatientRecord, RecordType } from '../types';
import FileIcon from './icons/FileIcon';
import MicrophoneIcon from './icons/MicrophoneIcon';
import BrainCircuitIcon from './icons/BrainCircuitIcon';

interface PatientOverviewProps {
  patient: Patient;
}

const RecordIcon: React.FC<{type: RecordType}> = ({ type }) => {
    switch(type) {
        case RecordType.VoiceNote:
            return <MicrophoneIcon className="w-5 h-5 text-blue-500" />;
        case RecordType.LabReport:
        case RecordType.ImagingReport:
            return <FileIcon className="w-5 h-5 text-green-500" />;
        case RecordType.Diagnosis:
            return <BrainCircuitIcon className="w-5 h-5 text-purple-500" />;
        default:
            return null;
    }
};

const getRecordTitle = (record: PatientRecord): string => {
    switch (record.type) {
        case RecordType.VoiceNote:
            return "Voice Note Dictation";
        case RecordType.LabReport:
            return `Lab Report: ${record.fileName}`;
        case RecordType.ImagingReport:
            return `Imaging Report: ${record.fileName}`;
        case RecordType.Diagnosis:
            return `AI Diagnosis Suggestion`;
        default:
            return "Medical Record";
    }
};

const PatientOverview: React.FC<PatientOverviewProps> = ({ patient }) => {
  const sortedRecords = [...patient.records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Patient Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><strong>Contact:</strong> {patient.contact}</p>
          <p><strong>Insurance:</strong> {patient.insurance || 'N/A'}</p>
          <div>
            <p className="font-semibold">Medical History:</p>
            <p className="whitespace-pre-wrap pl-2">{patient.medicalHistory || 'None'}</p>
          </div>
          <div>
            <p className="font-semibold">Allergies:</p>
            <p className="whitespace-pre-wrap pl-2">{patient.allergies || 'None known'}</p>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Medical Record History</h3>
        {sortedRecords.length > 0 ? (
          <div className="space-y-4">
            {sortedRecords.map(record => (
              <div key={record.id} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <RecordIcon type={record.type}/>
                        <h4 className="font-semibold">{getRecordTitle(record)}</h4>
                    </div>
                    <p className="text-sm text-gray-500">{new Date(record.date).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No records found for this patient.</p>
        )}
      </div>
    </div>
  );
};

export default PatientOverview;
