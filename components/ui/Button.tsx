import React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      disabled,
      leftIcon,
      rightIcon,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const baseClasses = "btn-base";
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;
    const widthClass = fullWidth ? "btn-full-width" : "";
    const loadingClass = isLoading ? "btn-loading" : "";

    const combinedClassName = [
      baseClasses,
      variantClass,
      sizeClass,
      widthClass,
      loadingClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={combinedClassName}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <span className="btn-spinner" aria-hidden="true">
            <svg
              className="animate-spin"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </span>
        )}
        {!isLoading && leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";
