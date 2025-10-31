import React, { useState } from 'react';
import { MOCK_DOCTORS } from '../../constants';
import { Department, Doctor } from '../../types';
import { View } from '../../App';

interface DoctorsPageProps {
    setView: (view: View, options?: { reset?: boolean }) => void;
}

const DoctorCard: React.FC<{ doctor: Doctor; onBook: () => void }> = ({ doctor, onBook }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <img src={doctor.photoUrl} alt={doctor.name} className="w-24 h-24 rounded-full mb-4 border-4 border-blue-100" />
        <h3 className="text-xl font-bold">{doctor.name}</h3>
        <p className="text-blue-600 font-semibold mt-1">{doctor.specialization}</p>
        <p className="text-gray-500 text-sm mt-1">{doctor.hospital}</p>
        <p className="text-gray-500 text-sm mt-2">{doctor.experience} years of experience</p>
        <button 
            onClick={onBook}
            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
        >
            Book Slot
        </button>
    </div>
);

const DoctorsPage: React.FC<DoctorsPageProps> = ({ setView }) => {
    const [filter, setFilter] = useState<Department | 'all'>('all');

    const filteredDoctors = filter === 'all' 
        ? MOCK_DOCTORS 
        : MOCK_DOCTORS.filter(doc => doc.specialization === filter);

    return (
        <div className="space-y-8">
             <header className="text-center">
                <h1 className="text-4xl font-bold text-gray-800">Our Doctors</h1>
                <p className="text-lg text-gray-500 mt-1">Find the specialist that's right for you.</p>
            </header>

            {/* Filters */}
            <div className="flex justify-center flex-wrap gap-2 bg-white p-3 rounded-lg shadow-sm">
                <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-md font-semibold ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>All</button>
                {Object.values(Department).map(dept => (
                     <button key={dept} onClick={() => setFilter(dept)} className={`px-4 py-2 rounded-md font-semibold ${filter === dept ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{dept}</button>
                ))}
            </div>

            {/* Doctor Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredDoctors.map(doctor => (
                    <DoctorCard 
                        key={doctor.uid} 
                        doctor={doctor} 
                        onBook={() => setView('booking')}
                    />
                ))}
            </div>
        </div>
    );
};

export default DoctorsPage;
