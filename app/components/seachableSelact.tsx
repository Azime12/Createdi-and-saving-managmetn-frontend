"use client";

import React, { useEffect, useState, useRef } from 'react';

interface BaseOption {
  id: string;
  label: string;
}

interface SearchableSelectProps<T extends BaseOption> {
  value: T | null;
  onChange: (option: T | null) => void;
  fetchOptions: (search: string) => Promise<T[]>;
  error?: string;
  touched?: boolean;
  primaryColor?: string;
  label?: string;
  placeholder?: string;
  minSearchLength?: number;
  onSearch?: (query: string) => void;
  loading?: boolean;
}

const SearchableSelect = <T extends BaseOption>({
  value,
  onChange,
  fetchOptions,
  error,
  touched,
  primaryColor = '#4F46E5',
  label,
  placeholder = 'Start typing...',
  minSearchLength = 2,
  onSearch,
  loading = false,
}: SearchableSelectProps<T>) => {
  const [search, setSearch] = useState(value?.label || '');
  const [options, setOptions] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setSearch(value.label);
    } else {
      setSearch('');
    }
  }, [value]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.length >= minSearchLength) {
        fetchOptions(search)
          .then((data) => setOptions(data))
          .catch(() => setOptions([]));
      } else {
        setOptions([]);
      }
      if (onSearch) {
        onSearch(search);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [search, fetchOptions, minSearchLength, onSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: T) => {
    onChange(option);
    setSearch(option.label);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setSearch('');
    setIsOpen(false);
  };

  const showError = error && touched;

  return (
    <div ref={containerRef} className="relative mb-4">
      {label && (
        <label className={`block mb-1 text-sm font-medium ${showError ? 'text-red-500' : 'text-gray-700'}`}>
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            if (e.target.value === '') {
              onChange(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md outline-none transition-all duration-200 ${
            showError ? 'border-red-500' : 'border-gray-300 focus:border-[2px]'
          }`}
          style={{
            borderColor: showError ? 'red' : isOpen ? primaryColor : undefined,
          }}
        />
        {search && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <ul className="absolute z-50 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <li className="px-4 py-2 text-gray-500 text-sm">Loading...</li>
          ) : options.length === 0 && search.length >= minSearchLength ? (
            <li className="px-4 py-2 text-gray-500 text-sm">No results found</li>
          ) : (
            options.map((option) => (
              <li
                key={option.id}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 cursor-pointer text-sm hover:bg-opacity-90 ${
                  value?.id === option.id ? 'bg-blue-50' : ''
                }`}
                style={{
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = primaryColor;
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = value?.id === option.id ? 'rgb(239 246 255)' : 'transparent';
                  e.currentTarget.style.color = 'inherit';
                }}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}

      {showError && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default SearchableSelect;