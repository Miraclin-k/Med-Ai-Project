import React from 'react';
import { Department } from '../../types';
import StethoscopeIcon from '../icons/StethoscopeIcon';
import BrainCircuitIcon from '../icons/BrainCircuitIcon';
import HeartIcon from '../icons/HeartIcon';
import BoneIcon from '../icons/BoneIcon';
import UserIcon from '../icons/UserIcon';

interface DoctorSpecializationPageProps {
  onSelect: (department: Department) => void;
}

const departmentIcons: { [key in Department]: React.ReactNode } = {
    [Department.Cardiology]: <HeartIcon className="w-8 h-8" />,
    [Department.Neurology]: <BrainCircuitIcon className="w-8 h-8" />,
    [Department.Orthopedics]: <BoneIcon className="w-8 h-8" />,
    [Department.Pediatrics]: <UserIcon className="w-8 h-8" />, // Placeholder, needs specific icon
    [Department.Dermatology]: <UserIcon className="w-8 h-8" />,
    [Department.General]: <StethoscopeIcon className="w-8 h-8" />,
};

const SpecializationCard: React.FC<{
    department: Department;
    icon: React.ReactNode;
    onClick: () => void;
}> = ({ department, icon, onClick }) => (
    <button
        onClick={onClick}
        className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-blue-50"
    >
        <div className="text-blue-600 mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{department}</h3>
    </button>
);


const DoctorSpecializationPage: React.FC<DoctorSpecializationPageProps> = ({ onSelect }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">Select Your Department</h1>
        <p className="text-lg text-gray-500 mt-2">Choose your specialization to proceed to your patient dashboard.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.values(Department).map(dept => (
          <SpecializationCard
            key={dept}
            department={dept}
            icon={departmentIcons[dept]}
            onClick={() => onSelect(dept)}
          />
        ))}
      </div>
    </div>
  );
};

export default DoctorSpecializationPage;
