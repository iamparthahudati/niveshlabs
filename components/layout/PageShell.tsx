import React from "react";
import { SiteHeader } from "@/components/header/SiteHeader";
import { Footer } from "@/components/footer/Footer";

export interface PageShellProps {
  children: React.ReactNode;
  mainLabel?: string;
  className?: string;
  showMarketStrip?: boolean;
  showDisclaimer?: boolean;
}

export function PageShell({
  children,
  mainLabel = "Main content",
  className = "",
  showMarketStrip = true,
  showDisclaimer = true,
}: PageShellProps) {
  return (
    <div className={`page-shell ${className}`}>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <SiteHeader showMarketStrip={showMarketStrip} />

      <main id="main" className="page-main" aria-label={mainLabel}>
        {children}
      </main>

      <Footer showDisclaimer={showDisclaimer} />
    </div>
  );
}
