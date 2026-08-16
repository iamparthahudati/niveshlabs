"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin-header";
import { ArticleEditor } from "@/components/article-editor";
import { Article } from "@/lib/admin-api";

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/admin/articles/${id}`, { credentials: "include" })
      .then((response) => {
        if (response.status === 401) {
          router.replace("/admin/login");
          throw new Error("Please sign in again.");
        }
        if (!response.ok) throw new Error("The article could not be loaded.");
        return response.json();
      })
      .then((data) => { if (active) setArticle(data); })
      .catch((reason) => { if (active) setError(reason.message); });
    return () => { active = false; };
  }, [id, router]);

  return (
    <div className="admin-shell">
      <AdminHeader admin={null} />
      <main className="admin-main editor-main">
        {error ? <p className="admin-form-error" role="alert">{error}</p> : article ? <ArticleEditor article={article} /> : <p className="admin-loading-inline">Loading article…</p>}
      </main>
    </div>
  );
}
