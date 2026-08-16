import React from "react";
import { Brand } from "./Brand";
import { MarketStrip } from "./MarketStrip";
import { PrimaryNav } from "./PrimaryNav";
import { SearchForm } from "./SearchForm";
import { AccountButton } from "./AccountButton";
import { MobileMenu } from "./MobileMenu";

export interface SiteHeaderProps {
  className?: string;
  showMarketStrip?: boolean;
}

export function SiteHeader({
  className = "",
  showMarketStrip = true,
}: SiteHeaderProps) {
  return (
    <header className={`site-header ${className}`}>
      {showMarketStrip && <MarketStrip />}

      <div className="navbar">
        <Brand />
        <PrimaryNav className="desktop-nav" />

        <div className="header-actions">
          <SearchForm />
          <AccountButton />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
