import { AdminHeader } from "@/components/admin-header";
import { ArticleEditor } from "@/components/article-editor";

export default function NewArticlePage() {
  return (
    <div className="admin-shell">
      <AdminHeader admin={null} />
      <main className="admin-main editor-main">
        <ArticleEditor />
      </main>
    </div>
  );
}
