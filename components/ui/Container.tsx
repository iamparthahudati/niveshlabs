import React from "react";

export type ContainerSize = "default" | "narrow" | "wide" | "full";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: ContainerSize;
}

export function Container({
  as: Component = "div",
  size = "default",
  children,
  className = "",
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`container-base container-${size} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
