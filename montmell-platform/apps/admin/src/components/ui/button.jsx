import { cn } from '../../lib/utils';

const VARIANTS = {
  default: 'bg-blue-700 text-white hover:bg-blue-800',
  outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50',
  premium: 'bg-amber-500 text-white hover:bg-amber-600',
};

export function Button({ variant = 'default', className, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        className
      )}
      {...props}
    />
  );
}
