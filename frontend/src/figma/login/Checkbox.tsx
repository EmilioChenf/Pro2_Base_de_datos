import { forwardRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className="flex items-center cursor-pointer group">
        <input
          ref={ref}
          type="checkbox"
          className="w-4 h-4 text-[var(--primary-hover)] border-[rgba(8,252,184,0.34)] rounded focus:ring-2 focus:ring-[var(--color-primary)] cursor-pointer"
          {...props}
        />
        <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
          {label}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

