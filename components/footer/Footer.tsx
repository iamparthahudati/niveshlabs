import React from "react";
import Link from "next/link";
import { Brand } from "@/components/header/Brand";
import { Disclaimer } from "./Disclaimer";
import { LegalLinks } from "./LegalLinks";
import { Container } from "@/components/ui/Container";

export interface FooterProps {
  className?: string;
  showDisclaimer?: boolean;
}

export function Footer({
  className = "",
  showDisclaimer = true,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`site-footer ${className}`} role="contentinfo">
      <Container size="default">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col footer-brand-col">
            <Brand />
            <p className="footer-tagline">
              Empowering confident financial decisions with accurate calculators, unbiased insights, and market data.
            </p>
          </div>

          {/* Calculators Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Popular Calculators</h4>
            <ul className="footer-link-list">
              <li><Link href="/calculators/sip">SIP Calculator</Link></li>
              <li><Link href="/calculators/lumpsum">Lumpsum Calculator</Link></li>
              <li><Link href="/calculators/emi">EMI Calculator</Link></li>
              <li><Link href="/calculators/swp">SWP Calculator</Link></li>
              <li><Link href="/calculators/income-tax">Income Tax Estimator</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Learn & Explore</h4>
            <ul className="footer-link-list">
              <li><Link href="/#learn">Financial Guides</Link></li>
              <li><Link href="/#markets">Market Snapshot</Link></li>
              <li><Link href="/#mutual-funds">Mutual Funds 101</Link></li>
              <li><Link href="/#credit-cards">Credit Card Basics</Link></li>
            </ul>
          </div>

          {/* Legal / Company Column */}
          <div className="footer-col">
            <h4 className="footer-heading">Trust & Legal</h4>
            <LegalLinks />
          </div>
        </div>

        {showDisclaimer && (
          <div className="footer-disclaimer-wrapper">
            <Disclaimer compact />
          </div>
        )}

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} NiveshLabs. All rights reserved.
          </p>
          <p className="footer-made">
            Built for clarity, speed, and accuracy.
          </p>
        </div>
      </Container>
    </footer>
  );
}
