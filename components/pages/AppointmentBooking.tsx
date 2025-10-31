import React, { useState, useMemo } from 'react';
import { MOCK_DOCTORS } from '../../constants';
import { Department, Doctor } from '../../types';

type BookingStage = 'details' | 'confirmation';

const AppointmentBooking: React.FC = () => {
    const [stage, setStage] = useState<BookingStage>('details');
    const [department, setDepartment] = useState<Department | ''>('');
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    
    const availableDoctors = useMemo(() => {
        return department ? MOCK_DOCTORS.filter(d => d.specialization === department) : [];
    }, [department]);

    const availableTimes = useMemo(() => {
        if (!doctor || !date) return [];
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        return doctor.availability[dayOfWeek] || [];
    }, [doctor, date]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(department && doctor && date && time) {
            setStage('confirmation');
        } else {
            alert('Please fill out all fields.');
        }
    };

    if (stage === 'confirmation') {
        return (
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h1 className="text-3xl font-bold text-gray-800">Appointment Confirmed!</h1>
                <p className="text-gray-600 mt-2">A confirmation email with your QR code has been sent.</p>
                <div className="mt-6 p-6 border rounded-lg bg-gray-50 text-left space-y-2">
                    <p><strong>Doctor:</strong> {doctor?.name}</p>
                    <p><strong>Department:</strong> {department}</p>
                    <p><strong>Date:</strong> {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Time:</strong> {time}</p>
                </div>
                <div className="mt-6 flex justify-center">
                    {/* Placeholder for QR Code */}
                    <div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">QR Code</p>
                    </div>
                </div>
                <button onClick={() => setStage('details')} className="mt-8 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md">Book Another Appointment</button>
            </div>
        );
    }
    

    return (
        <div className="max-w-2xl mx-auto">
             <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">Book an Appointment</h1>
                <p className="text-lg text-gray-500 mt-1">Select a department and doctor to see available slots.</p>
            </header>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">1. Select Department</label>
                    <select value={department} onChange={e => { setDepartment(e.target.value as Department); setDoctor(null); setTime(''); }} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm">
                        <option value="">-- Choose a Department --</option>
                        {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                
                {department && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700">2. Select Doctor</label>
                        {/* Fix: Changed doctor.id to doctor.uid to match the Doctor type. */}
                        <select value={doctor?.uid || ''} onChange={e => { setDoctor(availableDoctors.find(d => d.uid === e.target.value) || null); setTime(''); }} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm">
                            <option value="">-- Choose a Doctor --</option>
                            {/* Fix: Changed d.id to d.uid to match the Doctor type. */}
                            {availableDoctors.map(d => <option key={d.uid} value={d.uid}>{d.name}</option>)}
                        </select>
                    </div>
                )}
                
                {doctor && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700">3. Select Date</label>
                        <input type="date" value={date} onChange={e => { setDate(e.target.value); setTime(''); }} className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm"/>
                    </div>
                )}

                {date && availableTimes.length > 0 && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700">4. Select Time Slot</label>
                        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {availableTimes.map(t => (
                                <button key={t} type="button" onClick={() => setTime(t)} className={`p-2 rounded-md font-semibold text-center ${time === t ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                 {date && availableTimes.length === 0 && (
                    <p className="text-sm text-center text-red-500 bg-red-50 p-3 rounded-md">Dr. {doctor?.name} has no availability on this day. Please select another date.</p>
                 )}

                <button type="submit" disabled={!time} className="w-full py-3 bg-green-600 text-white font-bold text-lg rounded-md hover:bg-green-700 disabled:bg-gray-400">
                    Confirm Booking
                </button>
            </form>
        </div>
    );
};

export default AppointmentBooking;