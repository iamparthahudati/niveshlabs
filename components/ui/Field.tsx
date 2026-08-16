import React, { useId } from "react";

export interface FieldProps {
  label: string;
  id?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  id: explicitId,
  error,
  helperText,
  required = false,
  className = "",
  children,
}: FieldProps) {
  const generatedId = useId();
  const fieldId = explicitId || generatedId;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  // Clone child input to attach id, aria-invalid, aria-describedby
  const describedBy = [
    error ? errorId : null,
    helperText ? helperId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`form-field ${error ? "has-error" : ""} ${className}`}>
      <label htmlFor={fieldId} className="form-label">
        <span>{label}</span>
        {required && <span className="text-required" aria-hidden="true">*</span>}
      </label>
      <div className="form-control-wrapper">
        {React.isValidElement<React.HTMLAttributes<HTMLElement> & { id?: string; required?: boolean; "aria-invalid"?: boolean | "true" | "false"; "aria-describedby"?: string }>(children)
          ? React.cloneElement(children, {
              id: children.props.id || fieldId,
              "aria-invalid": !!error || undefined,
              "aria-describedby": describedBy || undefined,
              required: required || children.props.required,
            })
          : children}
      </div>
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="form-helper">
          {helperText}
        </p>
      )}
    </div>
  );
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`form-input ${hasError ? "input-error" : ""} ${className}`}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", hasError, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`form-select ${hasError ? "select-error" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", hasError, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`form-textarea ${hasError ? "textarea-error" : ""} ${className}`}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
