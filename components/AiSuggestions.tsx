import React, { useState } from 'react';
import { Patient, PatientRecord, RecordType, Diagnosis } from '../types';
import { geminiService } from '../services/geminiService';

interface AiSuggestionsProps {
  patient: Patient;
  addPatientRecord: (patientId: string, record: PatientRecord) => void;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({ patient, addPatientRecord }) => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Omit<Diagnosis, 'type' | 'symptoms'> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    if (!symptoms) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await geminiService.getDiagnosisSuggestion(symptoms, patient.medicalHistory);
      const parsedResult = JSON.parse(response.text);
      setResult(parsedResult);

      const newRecord: PatientRecord = {
        id: `rec-${Date.now()}`,
        date: new Date().toISOString(),
        type: RecordType.Diagnosis,
        symptoms,
        ...parsedResult,
      };
      // Fix: Changed patient.id to patient.uid to match the Patient type.
      addPatientRecord(patient.uid, newRecord);

    } catch (err) {
      console.error(err);
      setError('Failed to get suggestions. The model may have returned an invalid format.');
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.75) return 'bg-red-500';
    if (confidence > 0.5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-purple-50 border-l-4 border-purple-500 text-purple-800 rounded-r-lg">
        <p className="font-semibold">AI Diagnostic Decision Support</p>
        <p className="text-sm">Enter patient symptoms and chief complaints to generate a list of potential diagnoses based on the AI model's analysis.</p>
      </div>

      <div className="p-4 border rounded-lg bg-gray-50">
        <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
          Enter Symptoms (e.g., "persistent cough, fever of 101F, shortness of breath")
        </label>
        <textarea
          id="symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={3}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-purple-900"
        />
        <button
          onClick={handleGetSuggestions}
          disabled={isLoading || !symptoms}
          className="mt-2 px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Generating...' : 'Get Suggestions'}
        </button>
      </div>
      
      {error && <p className="text-red-500">{error}</p>}
      
      {result && (
        <div>
          <h3 className="text-xl font-bold mb-4">Diagnostic Suggestions</h3>
          {result.criticalAlert && (
             <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                <p className="font-bold">CRITICAL ALERT</p>
                <p>{result.criticalAlert}</p>
             </div>
          )}

          <div className="space-y-4">
            {result.potentialDiagnoses.map((diag, index) => (
              <div key={index} className="p-4 border rounded-lg shadow-sm bg-white">
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-semibold text-blue-700">{diag.condition}</h4>
                  <span className="text-lg font-bold">{Math.round(diag.confidence * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div 
                    className={`h-2.5 rounded-full ${getConfidenceColor(diag.confidence)}`}
                    style={{ width: `${diag.confidence * 100}%` }}
                  ></div>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  <span className="font-semibold">Rationale:</span> {diag.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiSuggestions;