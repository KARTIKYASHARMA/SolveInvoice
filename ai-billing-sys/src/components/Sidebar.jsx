import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    LogOut,
    BrainCircuit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function Sidebar() {
    const { logout, user } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: PlusCircle, label: 'Create Invoice', path: '/create-invoice' },
        { icon: BrainCircuit, label: 'AI Analytics', path: '/analytics' }, // 🔥 NEW
    ];

    return (
        <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0">
            {/* Logo */}
            <div className="p-6 flex items-center mb-6">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-3">
                    <span className="font-bold text-white">S</span>
                </div>
                <span className="text-xl font-bold tracking-wide">
                    SolveInvoice
                </span>
            </div>

            {/* Navigation */}
            <div className="flex-1 px-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center px-4 py-3 rounded-lg transition-colors text-slate-300 hover:text-white hover:bg-white/10",
                                isActive &&
                                    "bg-primary-600 text-white shadow-md hover:bg-primary-700"
                            )
                        }
                    >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            {/* User Info + Logout */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center mb-4 px-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-400 to-purple-500 flex items-center justify-center text-xs font-bold">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-white">
                            {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-slate-400">
                            {user?.role || 'Client'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                </button>
            </div>
        </div>
    );
}
