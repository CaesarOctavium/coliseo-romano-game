import { cn } from '../../lib/utils';

const VARIANTS = {
  default: 'bg-gray-100 text-gray-700',
  pro: 'bg-amber-100 text-amber-800',
  free: 'bg-gray-100 text-gray-600',
  demo: 'bg-purple-100 text-purple-800',
};

export function Badge({ variant = 'default', className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        VARIANTS[variant],
        className
      )}
      {...props}
    />
  );
}
