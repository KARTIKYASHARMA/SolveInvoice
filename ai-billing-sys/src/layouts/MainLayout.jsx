import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar for desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
                {/* Sidebar is fixed, so we need a placeholder to push content */}
            </div>
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto w-full">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
