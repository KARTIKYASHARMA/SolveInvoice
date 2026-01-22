import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', isLoading, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
        primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500",
        outline: "border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900 focus:ring-slate-500",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-900",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    };

    const sizes = {
        default: "h-10 py-2 px-4 text-sm",
        sm: "h-9 px-3 text-xs w-auto",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
    };

    return (
        <button
            ref={ref}
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
