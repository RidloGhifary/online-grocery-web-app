import React from "react";

interface MainButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "error" | "danger";
  fullWidth?: boolean;
}

const MainButton: React.FC<MainButtonProps> = ({
  text,
  onClick,
  disabled = false,
  variant = "primary",
  fullWidth = false,
}) => {
  const baseStyles = "btn mt-2";
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    error: "bg-red-500 text-white hover:bg-red-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  const disabledStyles = disabled
    ? "bg-gray-400 text-gray-500 cursor-not-allowed"
    : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${
        fullWidth ? "w-full" : ""
      } ${disabledStyles}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default MainButton;
