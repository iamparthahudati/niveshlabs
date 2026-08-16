import React from "react";

export interface MarketItemData {
  name: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface MarketItemProps {
  item: MarketItemData;
  className?: string;
}

export function MarketItem({ item, className = "" }: MarketItemProps) {
  return (
    <div className={`market-item ${className}`}>
      <strong>{item.name}</strong>
      <span>{item.value}</span>
      <span
        className={`market-change ${
          item.trend === "up" ? "market-up" : "market-down"
        }`}
        aria-label={`${item.name} is ${item.trend} by ${item.change}`}
      >
        <i aria-hidden="true" />
        {item.change}
      </span>
    </div>
  );
}
