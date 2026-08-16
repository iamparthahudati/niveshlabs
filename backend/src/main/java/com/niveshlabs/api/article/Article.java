package com.niveshlabs.api.article;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "articles")
public class Article {

    public enum Status { DRAFT, PUBLISHED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 180)
    private String title;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(nullable = false, length = 320)
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, length = 20)
    private String status = Status.DRAFT.name();

    @Column(name = "published_at")
    private Instant publishedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected Article() {}

    public Article(String title, String slug, String summary, String content, Status status) {
        update(title, slug, summary, content, status);
        this.createdAt = Instant.now();
    }

    public void update(String title, String slug, String summary, String content, Status status) {
        this.title = title;
        this.slug = slug;
        this.summary = summary;
        this.content = content;
        this.status = status.name();
        this.updatedAt = Instant.now();
        this.publishedAt = status == Status.PUBLISHED
            ? (this.publishedAt == null ? Instant.now() : this.publishedAt)
            : null;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getSlug() { return slug; }
    public String getSummary() { return summary; }
    public String getContent() { return content; }
    public String getStatus() { return status; }
    public Instant getPublishedAt() { return publishedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
