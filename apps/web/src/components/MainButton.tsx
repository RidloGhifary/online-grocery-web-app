import React from "react";

interface MainButtonProps {
  text: React.ReactNode | string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "error" | "danger" | "static";
  fullWidth?: boolean;
  className?: string;
}

const MainButton: React.FC<MainButtonProps> = ({
  text,
  onClick,
  disabled = false,
  variant = "primary",
  fullWidth = false,
  className = "",
}) => {
  const baseStyles = "btn";
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-secondary",
    secondary: "bg-secondary text-white hover:bg-third",
    error: "bg-red-600 text-white hover:bg-red-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    static: "bg-gray-600 text-white hover:bg-gray-700",
  };
  const disabledStyles = disabled
    ? "bg-gray-400 text-gray-500 cursor-not-allowed"
    : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${
        fullWidth ? "w-full" : ""
      } ${disabledStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default MainButton;
