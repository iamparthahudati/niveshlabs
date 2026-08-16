import React from "react";
import { PrimaryNav, NavItem } from "./PrimaryNav";
import { SearchForm } from "./SearchForm";

export interface MobileMenuProps {
  items?: NavItem[];
  className?: string;
}

export function MobileMenu({ items, className = "mobile-menu" }: MobileMenuProps) {
  return (
    <details className={className}>
      <summary aria-label="Toggle navigation menu">
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </summary>
      <div className="mobile-menu-panel">
        <PrimaryNav items={items} className="mobile-nav" />
        <div className="mobile-menu-divider" />
        <SearchForm
          id="mobile-site-search"
          placeholder="Search NiveshLabs"
          className="mobile-search"
        />
      </div>
    </details>
  );
}
