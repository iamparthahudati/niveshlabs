import React from "react";
import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { Icon } from "@/components/ui/Icon";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  baseUrl?: string;
}

export function Breadcrumbs({
  items,
  showHome = true,
  className = "",
  baseUrl = "https://niveshlabs.com",
}: BreadcrumbsProps) {
  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: "Home", href: "/" }, ...items]
    : items;

  // Generate BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href
        ? {
            item: item.href.startsWith("http")
              ? item.href
              : `${baseUrl}${item.href}`,
          }
        : {}),
    })),
  };

  return (
    <>
      <JsonLd schema={breadcrumbSchema} />
      <nav
        aria-label="Breadcrumb"
        className={`breadcrumbs-nav ${className}`}
      >
        <ol className="breadcrumbs-list">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;

            return (
              <li
                key={`${item.label}-${index}`}
                className={`breadcrumb-item ${isLast ? "is-current" : ""}`}
              >
                {index > 0 && (
                  <span className="breadcrumb-separator" aria-hidden="true">
                    <Icon name="chevron-right" size={12} />
                  </span>
                )}
                {isLast || !item.href ? (
                  <span
                    className="breadcrumb-current"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className="breadcrumb-link">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
