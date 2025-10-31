import React from 'react';
import ChartBarIcon from '../icons/ChartBarIcon';
import UserIcon from '../icons/UserIcon';
import CalendarIcon from '../icons/CalendarIcon';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
        <div className="bg-blue-100 text-blue-600 rounded-full p-3">
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const ChartPlaceholder: React.FC<{ title: string; type: 'line' | 'pie' | 'bar' }> = ({ title, type }) => (
    <div className="bg-white p-6 rounded-lg shadow-md h-80">
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        <div className="h-full w-full flex items-center justify-center bg-gray-50 rounded-md">
            <p className="text-gray-400">[{type.charAt(0).toUpperCase() + type.slice(1)} Chart Placeholder]</p>
            {/* In a real app, a library like Chart.js or D3 would render a chart here */}
        </div>
    </div>
);


const AnalyticsDashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-4xl font-bold text-gray-800">Analytics Dashboard</h1>
                <p className="text-lg text-gray-500 mt-1">Key metrics and performance overview.</p>
            </header>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Patients" value="1,284" icon={<UserIcon className="w-6 h-6"/>} />
                <StatCard title="Appointments Today" value="72" icon={<CalendarIcon className="w-6 h-6"/>} />
                <StatCard title="Reports Analyzed (Week)" value="315" icon={<ChartBarIcon className="w-6 h-6"/>} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartPlaceholder title="Patient Growth (Last 6 Months)" type="line" />
                <ChartPlaceholder title="Disease Category Distribution" type="pie" />
            </div>
             <div className="grid grid-cols-1 gap-6">
                <ChartPlaceholder title="Appointments per Department" type="bar" />
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
