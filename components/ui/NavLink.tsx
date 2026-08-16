"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  activeClassName?: string;
  exact?: boolean;
  isActive?: boolean;
}

export function NavLink({
  href,
  children,
  className = "",
  activeClassName = "active",
  exact = false,
  isActive: explicitIsActive,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();

  const isCurrent =
    explicitIsActive !== undefined
      ? explicitIsActive
      : exact
      ? pathname === href
      : pathname?.startsWith(href) && (href !== "/" || pathname === "/");

  const combinedClass = [className, isCurrent ? activeClassName : ""]
    .filter(Boolean)
    .join(" ");

  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  if (isExternal) {
    return (
      <a
        href={href}
        className={combinedClass}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={combinedClass}
      aria-current={isCurrent ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}
