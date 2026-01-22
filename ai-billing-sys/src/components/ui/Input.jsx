import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, error, label, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-sm",
                    error && "border-red-500 focus:ring-red-500",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && (
                <p className="mt-1 text-xs text-red-500 animate-fade-in">{error}</p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export { Input };
