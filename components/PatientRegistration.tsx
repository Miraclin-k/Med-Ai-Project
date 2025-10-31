import React, { useState } from 'react';
import { Patient, Gender } from '../types';

interface PatientRegistrationProps {
  onClose: () => void;
  onRegister: (patient: Omit<Patient, 'uid' | 'records'>) => void;
}

const PatientRegistration: React.FC<PatientRegistrationProps> = ({ onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: Gender.Male,
    contact: '',
    medicalHistory: '',
    allergies: '',
    insurance: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.contact) {
        alert("Please fill in all required fields.");
        return;
    }
    onRegister({
      ...formData,
      age: parseInt(formData.age, 10),
      gender: formData.gender as Gender,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Register New Patient</h2>
            <p className="text-sm text-gray-500">Enter the patient's details to create a new record.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Age *</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Contact Info (Email/Phone) *</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700">Medical History (e.g., Hypertension, Diabetes)</label>
              <textarea name="medicalHistory" value={formData.medicalHistory} onChange={handleChange} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Known Allergies</label>
              <textarea name="allergies" value={formData.allergies} onChange={handleChange} rows={2} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Insurance Provider (Optional)</label>
              <input type="text" name="insurance" value={formData.insurance} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </form>
         <div className="flex justify-end space-x-4 p-6 border-t bg-gray-50 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">Cancel</button>
            <button type="submit" onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold">Register Patient</button>
          </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
