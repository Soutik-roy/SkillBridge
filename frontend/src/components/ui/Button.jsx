import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export function Button({ className, variant = 'default', size = 'default', isLoading, children, ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-indigo-600 text-white shadow hover:bg-indigo-700",
    outline: "border border-gray-300 bg-transparent shadow-sm hover:bg-gray-100 text-gray-900",
    ghost: "hover:bg-gray-100 hover:text-gray-900 text-gray-700",
    destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600"
  };

  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
