import React from "react";

export type TagVariant = "neutral" | "success" | "danger" | "warning" | "indigo";
export type TagSize = "sm" | "md";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
  size?: TagSize;
  dot?: boolean;
  icon?: React.ReactNode;
}

export function Tag({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  icon,
  className = "",
  ...props
}: TagProps) {
  return (
    <span
      className={`tag-base tag-${variant} tag-size-${size} ${className}`}
      {...props}
    >
      {dot && <span className="tag-dot" aria-hidden="true" />}
      {icon && <span className="tag-icon" aria-hidden="true">{icon}</span>}
      <span className="tag-label">{children}</span>
    </span>
  );
}

// Badge alias
export const Badge = Tag;
