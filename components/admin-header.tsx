"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSession, secureFetch } from "@/lib/admin-api";

export function AdminHeader({ admin, active = "new" }: { admin: AdminSession | null; active?: "overview" | "new" }) {
  const router = useRouter();

  async function logout() {
    await secureFetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        <Link className="brand admin-brand" href="/" aria-label="Go to NiveshLabs website">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span className="brand-name">Nivesh<span>Labs</span></span>
        </Link>
        <nav className="admin-nav" aria-label="Admin navigation">
          <Link className={active === "overview" ? "active" : undefined} href="/admin">Overview</Link>
          <Link href="/admin#articles">Articles</Link>
          <Link className={active === "new" ? "active" : undefined} href="/admin/articles/new">New post</Link>
        </nav>
        <div className="admin-user">
          <span className="admin-user-copy"><strong>{admin?.displayName ?? "Admin"}</strong><small>{admin?.email}</small></span>
          <button className="admin-logout" type="button" onClick={logout}>Log out</button>
        </div>
      </div>
    </header>
  );
}
