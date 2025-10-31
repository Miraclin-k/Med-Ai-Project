import React, { useState } from 'react';
import { View } from '../../App';
import { UserRole, Gender, Department, Doctor, Patient } from '../../types';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';


interface SignUpPageProps {
  setView: (view: View, options?: { reset?: boolean }) => void;
  setLoginMessage: (message: string) => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ setView, setLoginMessage }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState<UserRole>('patient');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        
        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create a general user document with their role
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                name: name,
                role: role,
            });

            // Create a role-specific profile document
            if (role === 'patient') {
                const newPatient: Omit<Patient, 'uid'> = {
                    name: name,
                    email: email,
                    age: 0, // Placeholder
                    gender: Gender.Other, // Placeholder
                    contact: email,
                    medicalHistory: '',
                    allergies: '',
                    records: [],
                };
                await setDoc(doc(db, "patients", user.uid), newPatient);
            } else { // Doctor
                const newDoctor: Omit<Doctor, 'uid'> = {
                    name: name,
                    email: email,
                    specialization: Department.General, // Placeholder
                    experience: 0, // Placeholder
                    photoUrl: `https://i.pravatar.cc/150?u=${email}`,
                    hospital: 'General Hospital', // Placeholder
                    availability: {},
                };
                await setDoc(doc(db, "doctors", user.uid), newDoctor);
            }

            setLoginMessage('Account created successfully! Please sign in.');
            setView('login', { reset: true });

        } catch (err: any) {
             switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('An account with this email already exists.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak. Please choose a stronger password.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
                    break;
            }
            console.error("Sign up error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl flex overflow-hidden">
            <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 19L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 12L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M5 12L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M12 12C12 12 12 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                    <h1 className="text-3xl font-bold text-blue-600">MedAI+</h1>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
                    <p className="text-gray-500 mt-1">Join our platform to manage your health with AI.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">I am a...</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <button type="button" onClick={() => setRole('patient')} className={`flex-1 px-4 py-2 text-sm font-semibold rounded-l-md border ${role === 'patient' ? 'bg-blue-600 text-white border-blue-600 z-10' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Patient</button>
                            <button type="button" onClick={() => setRole('doctor')} className={`flex-1 px-4 py-2 text-sm font-semibold rounded-r-md border -ml-px ${role === 'doctor' ? 'bg-blue-600 text-white border-blue-600 z-10' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Doctor</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold disabled:bg-gray-400">
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <button onClick={() => setView('login')} className="font-semibold text-blue-600 hover:underline">
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
            <div className="hidden md:block w-1/2 bg-blue-600 p-12 text-white" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1584984711535-1918e4389e81?q=80&w=1974&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                 <div className="bg-blue-800 bg-opacity-50 p-8 rounded-lg">
                    <h2 className="text-3xl font-bold">A New Standard of Care</h2>
                    <p className="mt-4 text-blue-100">Register today to access a suite of AI-powered tools designed for modern healthcare professionals and patients.</p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;