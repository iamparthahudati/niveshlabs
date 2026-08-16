import React from "react";

export interface DisclaimerProps {
  className?: string;
  compact?: boolean;
}

export function Disclaimer({ className = "", compact = false }: DisclaimerProps) {
  if (compact) {
    return (
      <p className={`disclaimer-compact ${className}`}>
        <strong>Disclaimer:</strong> Investments in securities and mutual funds are subject to market risks. Read all scheme-related documents carefully. Content provided on NiveshLabs is for educational and illustrative purposes only and does not constitute financial or tax advice.
      </p>
    );
  }

  return (
    <aside
      className={`disclaimer-box ${className}`}
      aria-label="Financial risk disclaimer"
    >
      <div className="disclaimer-title">
        <span className="disclaimer-badge">Important Notice</span>
      </div>
      <p className="disclaimer-text">
        Mutual fund investments and financial instruments are subject to market risks. Please read all scheme-related documents carefully before investing. Historical performance and calculator projections do not guarantee future returns. The calculators, estimates, and articles on NiveshLabs are designed strictly for educational and illustrative purposes and should not be construed as investment, legal, or taxation advice.
      </p>
    </aside>
  );
}
