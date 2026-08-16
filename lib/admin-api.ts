export type AdminSession = {
  email: string;
  displayName: string;
  role: string;
};

export type Article = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  updatedAt: string;
};

type CsrfDetails = { token: string; headerName: string };

export async function getCsrf(): Promise<CsrfDetails> {
  const response = await fetch("/api/auth/csrf", { credentials: "include" });
  if (!response.ok) throw new Error("Could not start a secure session.");
  return response.json();
}

export async function secureFetch(url: string, options: RequestInit = {}) {
  const csrf = await getCsrf();
  const headers = new Headers(options.headers);
  headers.set(csrf.headerName, csrf.token);
  if (options.body) headers.set("Content-Type", "application/json");
  return fetch(url, { ...options, headers, credentials: "include" });
}
