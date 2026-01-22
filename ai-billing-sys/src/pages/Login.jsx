import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        // Basic email format validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-slate-900 bg-slate-50">
            {/* Left Side - Image/Branding */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-slate-900 opacity-90 z-10" />
                <div className="relative z-20 p-12 text-white">
                    <h1 className="text-5xl font-bold mb-6">SolveInvoice</h1>
                    <p className="text-xl text-slate-300 max-w-md">Streamline your SME invoicing with AI-powered insights and seamless management.</p>
                </div>
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary-500 blur-3xl opacity-20 z-0"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500 blur-3xl opacity-20 z-0"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h2>
                        <p className="mt-2 text-sm text-slate-600">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Input
                                label="Email"
                                type="email"
                                placeholder="demo@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="w-4 h-4" />}
                            />
                            <div>
                                <Input
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    icon={<Lock className="w-4 h-4" />}
                                />
                                <div className="mt-2 flex justify-end">
                                    <Link to="#" className="text-sm font-medium text-primary-600 hover:text-primary-500">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" className="w-full" isLoading={loading}>
                            Sign in
                        </Button>

                        <p className="text-center text-sm text-slate-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                                Create free account
                            </Link>
                        </p>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-400">
                        <p>Demo Credentials: demo@example.com / password</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
