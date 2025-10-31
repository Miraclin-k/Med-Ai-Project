import React, { useState, useEffect } from 'react';
import { Patient, PatientRecord, Department } from '../../types';
import { db } from '../../services/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

import PatientList from '../PatientList';
import Dashboard from '../Dashboard';
import PatientRegistration from '../PatientRegistration';

interface DoctorPortalProps {
    specialization: Department | null;
}

const DoctorPortal: React.FC<DoctorPortalProps> = ({ specialization }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchPatients = async () => {
            if (!specialization) return;
            setIsLoading(true);
            try {
                const patientsCol = collection(db, 'patients');
                const q = query(patientsCol, where('department', '==', specialization));
                const querySnapshot = await getDocs(q);
                const patientsList = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Patient));
                setPatients(patientsList);
                setSelectedPatient(patientsList[0] || null);
            } catch (error) {
                console.error("Error fetching patients: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, [specialization]);


    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatient(patient);
    };

    const handleRegisterPatient = async (newPatientData: Omit<Patient, 'uid' | 'records'>) => {
        try {
            const docRef = await addDoc(collection(db, "patients"), {
                ...newPatientData,
                department: specialization || Department.General,
                records: [],
            });
            const newPatient: Patient = {
                ...newPatientData,
                uid: docRef.id,
                records: [],
                department: specialization || Department.General
            };
            setPatients(prev => [...prev, newPatient]);
            setSelectedPatient(newPatient);
            setIsRegistering(false);
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Failed to register patient. Please try again.");
        }
    };
    
    // This function will be passed down but component will handle their own firestore updates.
    // We only update the local state for immediate UI feedback.
    const handleAddRecord = (patientId: string, record: PatientRecord) => {
         if (selectedPatient && selectedPatient.uid === patientId) {
            const updatedRecords = [...selectedPatient.records, record];
            const updatedPatient = { ...selectedPatient, records: updatedRecords };
            setSelectedPatient(updatedPatient);
            // Also update the main list
            setPatients(prev => prev.map(p => p.uid === patientId ? updatedPatient : p));
        }
    };
    
    if (isLoading) {
        return <div className="flex justify-center items-center h-full"><p>Loading patient data...</p></div>
    }

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-10rem)] bg-white rounded-lg shadow-xl overflow-hidden">
            <PatientList 
                patients={patients} 
                selectedPatient={selectedPatient}
                onSelectPatient={handleSelectPatient}
                onRegisterClick={() => setIsRegistering(true)}
            />
            <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-gray-50">
                {selectedPatient ? (
                    <Dashboard patient={selectedPatient} addPatientRecord={handleAddRecord} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-gray-500">No Patient Selected</h2>
                            <p className="mt-2 text-gray-400">
                                {patients.length > 0
                                ? "Please select a patient from the list."
                                : `No patients found for the ${specialization} department.`}
                            </p>
                        </div>
                    </div>
                )}
            </main>
            {isRegistering && (
                <PatientRegistration 
                    onClose={() => setIsRegistering(false)} 
                    onRegister={handleRegisterPatient} 
                />
            )}
        </div>
    );
};

export default DoctorPortal;
