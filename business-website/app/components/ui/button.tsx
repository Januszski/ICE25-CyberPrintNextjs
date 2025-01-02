import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  asChild = false,
  className,
  children,
  ...props
}) => {
  const Component = asChild ? "span" : "button"; // Use "span" or "button" based on asChild

  return (
    <Component
      className={clsx(
        "inline-flex items-center justify-center font-bold py-2 px-6 rounded-full transition duration-300",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
