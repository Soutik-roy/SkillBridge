import React from 'react';
import { cn } from '../../lib/utils';

export function Progress({ value, className, indicatorClassName }) {
  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-gray-100", className)}>
      <div 
        className={cn("h-full w-full flex-1 bg-indigo-600 transition-all", indicatorClassName)} 
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  );
}
