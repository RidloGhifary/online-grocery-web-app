"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  register: UseFormRegister<FieldValues> | any;
  errors: FieldErrors | any;
}

export default function InputField({
  id,
  label,
  type,
  required,
  register,
  errors,
  disabled,
  placeholder,
}: InputProps) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          required={required}
          placeholder={placeholder}
          disabled={disabled}
          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 sm:text-sm sm:leading-6"
          {...register(id)}
        />
      </div>
      <p className="mt-2 text-sm text-red-600">{errors}</p>
    </div>
  );
}
