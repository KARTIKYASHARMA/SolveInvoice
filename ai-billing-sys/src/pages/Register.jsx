import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Mail, Lock, AlertCircle, Briefcase } from 'lucide-react';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Client');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        if (!name || !email || !password) {
            setError('All fields are required');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await register(name, email, password, role);
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients for Premium Feel */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary-200 blur-3xl opacity-30 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-purple-200 blur-3xl opacity-30 pointer-events-none"></div>

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 relative z-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create an account</h2>
                    <p className="mt-2 text-sm text-slate-600">Start organizing your invoices today.</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {error}
                    </div>
                )}

                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Create a strong password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">Role</label>
                        <div className="relative">
                            <select
                                className="w-full h-10 pl-3 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white appearance-none"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="Client">Client</option>
                                <option value="Admin">Admin</option>
                            </select>
                            <Briefcase className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-6" isLoading={loading}>
                        Create account
                    </Button>
                </form>

                <p className="text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/" className="font-medium text-primary-600 hover:text-primary-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
