import React from "react";

export interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: Record<string, any> | Record<string, any>[];
  id?: string;
}

/**
 * Safely serialize JSON-LD to prevent XSS script injection vulnerabilities.
 */
function safeJsonLdReplacer(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function JsonLd({ schema, id }: JsonLdProps) {
  const json = safeJsonLdReplacer(schema);

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
