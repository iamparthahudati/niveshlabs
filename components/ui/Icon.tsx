import React from "react";

export type IconName =
  | "search"
  | "chevron-right"
  | "chevron-down"
  | "chevron-left"
  | "arrow-up"
  | "arrow-down"
  | "arrow-right"
  | "trend-up"
  | "trend-down"
  | "menu"
  | "close"
  | "check"
  | "info"
  | "alert"
  | "calculator"
  | "shield"
  | "sparkles"
  | "external-link"
  | "chart"
  | "book"
  | "news";

export interface IconProps extends React.SVGAttributes<SVGElement> {
  name: IconName;
  size?: number | string;
  className?: string;
  "aria-label"?: string;
}

export function Icon({
  name,
  size = 18,
  className = "",
  "aria-label": ariaLabel,
  ...props
}: IconProps) {
  const isHidden = !ariaLabel;

  const renderPath = () => {
    switch (name) {
      case "search":
        return (
          <>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </>
        );
      case "chevron-right":
        return <polyline points="9 18 15 12 9 6" />;
      case "chevron-down":
        return <polyline points="6 9 12 15 18 9" />;
      case "chevron-left":
        return <polyline points="15 18 9 12 15 6" />;
      case "arrow-up":
        return (
          <>
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </>
        );
      case "arrow-down":
        return (
          <>
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </>
        );
      case "arrow-right":
        return (
          <>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </>
        );
      case "trend-up":
        return (
          <>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </>
        );
      case "trend-down":
        return (
          <>
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
            <polyline points="17 18 23 18 23 12" />
          </>
        );
      case "menu":
        return (
          <>
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </>
        );
      case "close":
        return (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        );
      case "check":
        return <polyline points="20 6 9 17 4 12" />;
      case "info":
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </>
        );
      case "alert":
        return (
          <>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </>
        );
      case "calculator":
        return (
          <>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="16" y1="14" x2="16" y2="14.01" />
            <line x1="8" y1="14" x2="8" y2="14.01" />
            <line x1="12" y1="14" x2="12" y2="14.01" />
            <line x1="16" y1="18" x2="16" y2="18.01" />
            <line x1="8" y1="18" x2="8" y2="18.01" />
            <line x1="12" y1="18" x2="12" y2="18.01" />
          </>
        );
      case "shield":
        return <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
      case "sparkles":
        return (
          <path d="M12 2l2.4 5 5 2.4-5 2.4-2.4 5-2.4-5-5-2.4 5-2.4L12 2z" />
        );
      case "external-link":
        return (
          <>
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </>
        );
      case "chart":
        return (
          <>
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </>
        );
      case "book":
        return (
          <>
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
          </>
        );
      case "news":
        return (
          <>
            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
            <line x1="7" y1="9" x2="11" y2="9" />
            <line x1="7" y1="13" x2="13" y2="13" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon icon-${name} ${className}`}
      aria-hidden={isHidden}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
      {...props}
    >
      {renderPath()}
    </svg>
  );
}
