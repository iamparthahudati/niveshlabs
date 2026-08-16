package com.niveshlabs.api.article;

import java.time.Instant;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/admin/articles")
public class AdminArticleController {

    private final ArticleRepository articles;

    public AdminArticleController(ArticleRepository articles) {
        this.articles = articles;
    }

    @GetMapping
    public List<ArticleResponse> list() {
        return articles.findAllByOrderByUpdatedAtDesc().stream().map(ArticleResponse::from).toList();
    }

    @GetMapping("/{id}")
    public ArticleResponse get(@PathVariable Long id) {
        return articles.findById(id).map(ArticleResponse::from)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ArticleResponse create(@Valid @RequestBody ArticleRequest request) {
        String slug = normalizeSlug(request.slug());
        if (articles.existsBySlug(slug)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An article with this slug already exists");
        }
        Article article = new Article(
            request.title().trim(), slug, request.summary().trim(), request.content().trim(), request.status()
        );
        return ArticleResponse.from(articles.save(article));
    }

    @PutMapping("/{id}")
    public ArticleResponse update(@PathVariable Long id, @Valid @RequestBody ArticleRequest request) {
        Article article = articles.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
        String slug = normalizeSlug(request.slug());
        if (articles.existsBySlugAndIdNot(slug, id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An article with this slug already exists");
        }
        article.update(request.title().trim(), slug, request.summary().trim(), request.content().trim(), request.status());
        return ArticleResponse.from(articles.save(article));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!articles.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found");
        }
        articles.deleteById(id);
    }

    private String normalizeSlug(String value) {
        String slug = value.trim().toLowerCase()
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("(^-|-$)", "");
        if (slug.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Slug must contain letters or numbers");
        }
        return slug;
    }

    public record ArticleRequest(
        @NotBlank @Size(max = 180) String title,
        @NotBlank @Size(max = 200) String slug,
        @NotBlank @Size(max = 320) String summary,
        @NotBlank String content,
        @NotNull Article.Status status
    ) {}

    public record ArticleResponse(
        Long id,
        String title,
        String slug,
        String summary,
        String content,
        String status,
        Instant publishedAt,
        Instant createdAt,
        Instant updatedAt
    ) {
        static ArticleResponse from(Article article) {
            return new ArticleResponse(
                article.getId(), article.getTitle(), article.getSlug(), article.getSummary(), article.getContent(),
                article.getStatus(), article.getPublishedAt(), article.getCreatedAt(), article.getUpdatedAt()
            );
        }
    }
}
