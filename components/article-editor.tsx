"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Article, secureFetch } from "@/lib/admin-api";

type ArticleForm = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
};

const emptyForm: ArticleForm = {
  title: "",
  slug: "",
  summary: "",
  content: "<p></p>",
  status: "DRAFT",
};

function articleToForm(article?: Article): ArticleForm {
  if (!article) return emptyForm;
  return {
    title: article.title,
    slug: article.slug,
    summary: article.summary,
    content: article.content,
    status: article.status,
  };
}

export function ArticleEditor({ article }: { article?: Article }) {
  const router = useRouter();
  const [form, setForm] = useState(() => articleToForm(article));
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(field: keyof ArticleForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateTitle(value: string) {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugTouched
        ? current.slug
        : value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    }));
  }

  async function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const response = await secureFetch(
        article ? `/api/admin/articles/${article.id}` : "/api/admin/articles",
        { method: article ? "PUT" : "POST", body: JSON.stringify(form) },
      );
      if (response.status === 401) return router.replace("/admin/login");
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.detail || body?.message || "The post could not be saved.");
      }

      const saved: Article = await response.json();
      if (saved.status === "PUBLISHED") {
        router.push(`/articles/${saved.slug}`);
      } else {
        router.push("/admin?message=draft-saved");
      }
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The post could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="post-editor-layout" onSubmit={saveArticle}>
      <section className="post-editor-card">
        <div className="post-editor-card-heading">
          <div>
            <p className="admin-eyebrow">{article ? "EDIT POST" : "NEW POST"}</p>
            <h1>{article ? "Edit article" : "Create a new article"}</h1>
            <p>Write the article in HTML, preview it, then save a draft or publish it.</p>
          </div>
          <Link className="editor-close" href="/admin" aria-label="Close editor">×</Link>
        </div>

        {message && <p className="admin-form-error" role="alert">{message}</p>}

        <div className="post-fields">
          <label>Title<input value={form.title} onChange={(event) => updateTitle(event.target.value)} maxLength={180} placeholder="Enter a clear article title" required /></label>
          <label>URL slug<div className="slug-input"><span>/articles/</span><input value={form.slug} onChange={(event) => { setSlugTouched(true); updateField("slug", event.target.value); }} maxLength={200} placeholder="example-article" required /></div></label>
          <label>Summary<textarea value={form.summary} onChange={(event) => updateField("summary", event.target.value)} maxLength={320} rows={3} placeholder="A short description shown on the article card" required /><small>{form.summary.length}/320 characters</small></label>
          <label className="html-field">
            <span>Article HTML</span>
            <textarea value={form.content} onChange={(event) => updateField("content", event.target.value)} rows={18} spellCheck={false} placeholder="<h2>Heading</h2>&#10;<p>Your article content…</p>" required />
            <small>Supported examples: &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;a&gt;, &lt;ul&gt;, &lt;ol&gt;, &lt;blockquote&gt; and &lt;img&gt;.</small>
          </label>
        </div>
      </section>

      <aside className="post-editor-sidebar">
        <section className="editor-side-card">
          <h2>Publish</h2>
          <label>Status<select value={form.status} onChange={(event) => updateField("status", event.target.value)}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option></select></label>
          <button className="publish-button" type="submit" disabled={saving}>{saving ? "Saving…" : form.status === "PUBLISHED" ? "Publish article" : "Save draft"}</button>
          <Link className="cancel-link" href="/admin">Cancel</Link>
        </section>

        <section className="editor-side-card preview-card">
          <div><h2>Live preview</h2><span>Sandboxed</span></div>
          <iframe title="Article HTML preview" sandbox="" srcDoc={`<!doctype html><html><head><style>body{font:15px/1.7 system-ui,sans-serif;color:#111a3a;margin:20px}img{max-width:100%;height:auto;border-radius:10px}a{color:#4f46df}h1,h2,h3{line-height:1.25}blockquote{border-left:3px solid #4f46df;margin-left:0;padding-left:16px;color:#667085}</style></head><body>${form.content}</body></html>`} />
        </section>
      </aside>
    </form>
  );
}
