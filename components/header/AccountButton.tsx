import React from "react";

export interface AccountButtonProps {
  initials?: string;
  onClick?: () => void;
  className?: string;
}

export function AccountButton({
  initials = "P",
  onClick,
  className = "account-button",
}: AccountButtonProps) {
  return (
    <button
      className={className}
      type="button"
      onClick={onClick}
      aria-label="User account and settings"
    >
      <span aria-hidden="true">{initials}</span>
    </button>
  );
}
