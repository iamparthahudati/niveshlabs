import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  hoverable?: boolean;
}

export function Card({
  as: Component = "div",
  children,
  className = "",
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <Component
      className={`card-base ${hoverable ? "card-hoverable" : ""} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  as: Component = "h3",
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & { as?: React.ElementType }) {
  return (
    <Component className={`card-title ${className}`} {...props}>
      {children}
    </Component>
  );
}

export function CardDescription({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`card-description ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card-content ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
}
