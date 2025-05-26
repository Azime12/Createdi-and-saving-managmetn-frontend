'use client';
import React, { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  label: string;
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
  primaryColor: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  touched,
  primaryColor = '#3b82f6',
  disabled = false,
  placeholder = 'Select an option',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && listboxRef.current) {
      const selectedOption = listboxRef.current.querySelector('[aria-selected="true"]');
      if (selectedOption) {
        (selectedOption as HTMLElement).scrollIntoView({ block: 'nearest' });
      }
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setOpen(!open);
        break;
      case 'Escape':
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          const currentIndex = options.indexOf(value);
          const nextIndex = (currentIndex + 1) % options.length;
          onChange(options[nextIndex]);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) {
          setOpen(true);
        } else {
          const currentIndex = options.indexOf(value);
          const prevIndex = (currentIndex - 1 + options.length) % options.length;
          onChange(options[prevIndex]);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div ref={selectRef} className={`relative w-full ${className}`}>
      <label
        id={`${name}-label`}
        htmlFor={name}
        className={`block text-sm font-medium mb-1.5 ${
          disabled ? 'text-gray-400' : 'text-gray-700'
        }`}
      >
        {label}
      </label>

      <div
        id={name}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${name}-label`}
        aria-controls={`${name}-listbox`}
        tabIndex={disabled ? -1 : 0}
        className={`w-full px-3 py-2.5 text-left rounded-lg border bg-white ${
          disabled
            ? 'bg-gray-50 cursor-not-allowed border-gray-200'
            : 'cursor-pointer hover:border-gray-400'
        } ${
          open ? 'ring-2' : ''
        } ${
          touched && error ? 'border-red-500' : 'border-gray-300'
        }`}
        style={{
          boxShadow: open
            ? `0 0 0 2px ${primaryColor}33`
            : touched && error
            ? '0 0 0 2px rgba(239, 68, 68, 0.2)'
            : 'none',
        }}
        onClick={() => !disabled && setOpen(!open)}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between">
          <span className={`truncate ${!value ? 'text-gray-400' : 'text-gray-800'}`}>
            {value || placeholder}
          </span>
          <span
            className="text-xs transition-transform duration-200"
            style={{ 
              color: open ? primaryColor : '#6b7280',
              transform: open ? 'rotate(180deg)' : 'none',
            }}
            aria-hidden="true"
          >
            ▼
          </span>
        </div>
      </div>

      {open && (
        <ul
          id={`${name}-listbox`}
          ref={listboxRef}
          role="listbox"
          aria-labelledby={`${name}-label`}
          className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto focus:outline-none"
          style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          {options.map((opt) => (
            <li
              key={opt}
              id={`${name}-option-${opt}`}
              role="option"
              aria-selected={value === opt}
              className={`px-3 py-2.5 cursor-pointer transition-colors duration-150 ${
                value === opt ? 'font-medium' : ''
              }`}
              style={{
                color: value === opt ? primaryColor : '#1f2937',
                backgroundColor: value === opt ? `${primaryColor}10` : 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${primaryColor}20`;
                e.currentTarget.style.color = primaryColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = value === opt ? `${primaryColor}10` : 'transparent';
                e.currentTarget.style.color = value === opt ? primaryColor : '#1f2937';
              }}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}

      {touched && error && (
        <p className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default CustomSelect;