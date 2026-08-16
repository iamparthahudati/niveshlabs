"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Article, AdminSession, secureFetch } from "@/lib/admin-api";
import { AdminHeader } from "@/components/admin-header";

export default function AdminPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminSession | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    try {
      const [sessionResponse, articlesResponse] = await Promise.all([
        fetch("/api/auth/me", { credentials: "include" }),
        fetch("/api/admin/articles", { credentials: "include" }),
      ]);
      if (sessionResponse.status === 401 || articlesResponse.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!sessionResponse.ok || !articlesResponse.ok) throw new Error();
      setAdmin(await sessionResponse.json());
      setArticles(await articlesResponse.json());
    } catch {
      setMessage("Could not load the admin data. Check that the Java backend is running.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadDashboard(), 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  const counts = useMemo(() => ({
    published: articles.filter((article) => article.status === "PUBLISHED").length,
    drafts: articles.filter((article) => article.status === "DRAFT").length,
  }), [articles]);

  async function deleteArticle(article: Article) {
    if (!window.confirm(`Delete “${article.title}”?`)) return;
    const response = await secureFetch(`/api/admin/articles/${article.id}`, { method: "DELETE" });
    if (response.ok) {
      setMessage("Article deleted.");
      await loadDashboard();
    } else {
      setMessage("Article could not be deleted.");
    }
  }

  if (loading) return <main className="admin-loading">Loading admin panel…</main>;

  return (
    <div className="admin-shell">
      <AdminHeader admin={admin} active="overview" />

      <main className="admin-main">
        <section className="admin-welcome" id="overview">
          <div><p className="admin-eyebrow">ADMIN PANEL</p><h1>Welcome back, {admin?.displayName ?? "Admin"}</h1><p>Manage the content that appears on NiveshLabs.</p></div>
          <Link className="view-site-button" href="/">View website</Link>
        </section>

        {message && <p className="admin-message" role="status">{message}</p>}

        <section className="admin-stats" aria-label="Website overview">
          <article className="admin-stat-card"><span>Published articles</span><strong>{counts.published}</strong><small>Visible content</small></article>
          <article className="admin-stat-card"><span>Drafts</span><strong>{counts.drafts}</strong><small>Work in progress</small></article>
          <article className="admin-stat-card"><span>Credit cards</span><strong>0</strong><small>Coming next</small></article>
          <article className="admin-stat-card"><span>Calculators</span><strong>0</strong><small>Coming later</small></article>
        </section>

        <section className="admin-panel" id="articles">
          <div className="admin-panel-heading"><div><h2>Articles</h2><p>Create, edit, publish and delete finance content.</p></div><Link className="admin-primary-link" href="/admin/articles/new">New article</Link></div>
          {articles.length === 0 ? (
            <p className="admin-empty">No articles yet. Create your first post to get started.</p>
          ) : (
            <div className="admin-article-list">
              {articles.map((article) => (
                <article className="admin-article-row" key={article.id}>
                  <div><span className={`article-status ${article.status.toLowerCase()}`}>{article.status}</span><h3>{article.title}</h3><p>/{article.slug}</p></div>
                  <div className="admin-row-actions">{article.status === "PUBLISHED" && <Link href={`/articles/${article.slug}`}>View</Link>}<Link href={`/admin/articles/${article.id}/edit`}>Edit</Link><button className="danger" type="button" onClick={() => void deleteArticle(article)}>Delete</button></div>
                </article>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
