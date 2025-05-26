import React from "react";

interface ButtonProps {
  buttonText: string;
  isLoading?: boolean;
  disabled?: boolean;
  primaryColor: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  buttonText,
  isLoading = false,
  disabled = false,
  primaryColor,
  onClick,
}) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full py-2 rounded-md transition-all duration-300 ease-in-out text-white`}
      style={{
        backgroundColor: primaryColor,
        opacity: isLoading || disabled ? 0.7 : 1, // Optional for showing loading/disabled state
      }}
      // Hover effect with Tailwind using a more standard background color
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.9";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
    >
      {isLoading ? "Creating..." : buttonText}
    </button>
  );
};

export default Button;
