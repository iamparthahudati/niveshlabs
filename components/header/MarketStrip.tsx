import React from "react";
import { MarketItem, MarketItemData } from "./MarketItem";

export const DEFAULT_MARKET_ITEMS: readonly MarketItemData[] = [
  { name: "NIFTY 50", value: "22,957.25", change: "+0.76%", trend: "up" },
  { name: "SENSEX", value: "75,399.86", change: "+0.71%", trend: "up" },
  { name: "BANK NIFTY", value: "49,585.65", change: "−0.28%", trend: "down" },
  { name: "GOLD", value: "₹72,354 / 10g", change: "+0.32%", trend: "up" },
  { name: "USD/INR", value: "83.24", change: "−0.12%", trend: "down" },
];

export interface MarketStripProps {
  items?: readonly MarketItemData[];
  note?: string;
  className?: string;
}

export function MarketStrip({
  items = DEFAULT_MARKET_ITEMS,
  note = "Sample data",
  className = "",
}: MarketStripProps) {
  return (
    <div className={`market-strip ${className}`} aria-label="Market overview snapshot">
      <div className="market-strip-track">
        {items.map((item) => (
          <MarketItem key={item.name} item={item} />
        ))}
        {note && <span className="market-note">{note}</span>}
      </div>
    </div>
  );
}
