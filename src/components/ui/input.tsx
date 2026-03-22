'use client';

import React, { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
  error,
  ...props
}: InputProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-text-secondary">{label}</label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-primary-dark border rounded-md px-3 py-2 text-text-primary
          placeholder:text-text-muted text-sm transition-all duration-150 outline-none
          ${
            error
              ? 'border-error focus:ring-2 focus:ring-error/50 focus:border-error'
              : 'border-border focus:ring-2 focus:ring-accent/50 focus:border-accent'
          }`}
        {...props}
      />
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}
