import React from "react";
import Link from "next/link";

export interface BrandProps {
  href?: string;
  className?: string;
}

export function Brand({ href = "/", className = "" }: BrandProps) {
  return (
    <Link className={`brand ${className}`} href={href} aria-label="NiveshLabs home">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="brand-name">
        Nivesh<span>Labs</span>
      </span>
    </Link>
  );
}
