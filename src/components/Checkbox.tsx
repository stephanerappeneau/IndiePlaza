import React from 'react';

interface CheckboxProps {
  label: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, onChange, isChecked }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        name={label}
        type="checkbox"
        checked={isChecked}
        className="form-checkbox h-5 w-5"
        onChange={onChange}
      />
      <label htmlFor={label} className="text-gray-700 select-none">
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
