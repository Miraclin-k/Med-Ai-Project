import React, { useState } from 'react';
import { View } from '../../App';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';


interface LoginPageProps {
  setView: (view: View, options?: { reset?: boolean }) => void;
  message?: string | null;
  setLoginMessage: (message: string | null) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setView, message, setLoginMessage }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoginMessage(null);
        setIsLoading(true);

        if (!email || !password) {
            setError('Please enter both email and password.');
            setIsLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged in App.tsx will handle navigation
        } catch (err: any) {
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    setError('Invalid email or password. Please try again.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
                    break;
            }
            console.error(err);
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
                    <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500">Sign in to access your dashboard.</p>
                </div>

                {message && <div className="mt-4 p-3 bg-green-100 text-green-800 border border-green-200 rounded-md">{message}</div>}

                <form onSubmit={handleFormSubmit} className="space-y-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold disabled:bg-gray-400">
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <button onClick={() => { setView('signup'); setLoginMessage(null); }} className="font-semibold text-blue-600 hover:underline">
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
             <div className="hidden md:block w-1/2 bg-blue-600 p-12 text-white" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
                <div className="bg-blue-800 bg-opacity-50 p-8 rounded-lg">
                    <h2 className="text-3xl font-bold">Intelligent Healthcare Starts Here</h2>
                    <p className="mt-4 text-blue-100">Join a new era of medical technology with AI-powered diagnostics, streamlined patient management, and data-driven insights.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
