"use client";
import { FormikProps, FormikErrors } from "formik";
import React from "react";
import "./CInput.css";

type CInputProps = {
  name: string;
  type: string;
  disabled?: boolean;
  required?: boolean;
  formik: FormikProps<any>;
  primaryColor?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholder?: string;
  label?: string;
  onFocus?: () => void;
  onBlur?: () => void;
};

const CInput: React.FC<CInputProps> = ({
  name,
  type,
  required = false,
  formik,
  primaryColor = "#0d8680",
  icon,
  rightIcon,
  placeholder,
  disabled = false,
  label,
  onFocus,
  onBlur,
}) => {
  const isError = formik.touched[name] && formik.errors[name];

  const getErrorMessage = (
    error: string | string[] | FormikErrors<any> | FormikErrors<any>[] | undefined
  ): string => {
    if (typeof error === "string") return error;
    if (Array.isArray(error)) return error.map((e) => (typeof e === "string" ? e : Object.values(e).join(", "))).join(", ");
    if (typeof error === "object") return Object.values(error).join(", ");
    return "";
  };

  const errorMessage = getErrorMessage(formik.errors[name]);

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={name} 
          className={`block text-sm font-medium mb-1 ${
            disabled ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`flex items-center rounded-md px-2 py-0.5 w-full transition-all duration-200 ${
          disabled 
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-white"
        } ${
          isError && !disabled
            ? "border border-red-500"
            : disabled
            ? "border border-gray-200"
            : "border border-gray-300 focus-within:border-[var(--focus-color)] focus-within:shadow-md"
        }`}
        style={{
          "--focus-color": primaryColor,
          boxShadow: isError && !disabled
            ? "0 0 5px rgba(255, 77, 77, 0.6)"
            : "none",
          borderWidth: "1.6px",
        } as React.CSSProperties}
      >
        {icon && (
          <span className={`${disabled ? "text-gray-400" : "text-gray-500"} mr-2`}>
            {icon}
          </span>
        )}
   {type === 'textarea' ? (
  <textarea
    id={name}
    name={name}
    disabled={disabled}
    value={formik.values[name] || ''}
    onChange={formik.handleChange}
    onBlur={(e) => {
      formik.handleBlur(e);
      onBlur?.();
    }}
    onFocus={onFocus}
    required={required}
    placeholder={placeholder || name.charAt(0).toUpperCase() + name.slice(1)}
    className={`text-sm w-full border-none outline-none focus:ring-0 resize-none min-h-[100px] ${
      disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-transparent'
    }`}
  />
) : (
  <input
    id={name}
    size={10}
    name={name}
    type={type}
    disabled={disabled}
    value={formik.values[name] || ''}
    onChange={formik.handleChange}
    onBlur={(e) => {
      formik.handleBlur(e);
      onBlur?.();
    }}
    onFocus={onFocus}
    required={required}
    placeholder={placeholder || name.charAt(0).toUpperCase() + name.slice(1)}
    className={`text-sm w-full border-none outline-none focus:ring-0 ${
      disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-transparent'
    }`}
  />
)}

        {rightIcon && (
          <span className={`${disabled ? "text-gray-400" : "text-gray-500"} ml-2`}>
            {rightIcon}
          </span>
        )}
      </div>
      {isError && !disabled && (
        <div className="text-red-500 text-xs mt-1">{errorMessage}</div>
      )}
    </div>
  );
};

export default CInput;