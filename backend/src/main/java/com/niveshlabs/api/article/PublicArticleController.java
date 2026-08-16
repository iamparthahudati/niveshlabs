package com.niveshlabs.api.article;

import java.time.Instant;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/articles")
public class PublicArticleController {

    private final ArticleRepository articles;

    public PublicArticleController(ArticleRepository articles) {
        this.articles = articles;
    }

    @GetMapping
    public List<PublicArticleResponse> list() {
        return articles.findAllByStatusOrderByPublishedAtDesc(Article.Status.PUBLISHED.name())
            .stream().map(PublicArticleResponse::from).toList();
    }

    @GetMapping("/{slug}")
    public PublicArticleResponse get(@PathVariable String slug) {
        return articles.findBySlugAndStatus(slug, Article.Status.PUBLISHED.name())
            .map(PublicArticleResponse::from)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found"));
    }

    public record PublicArticleResponse(
        Long id,
        String title,
        String slug,
        String summary,
        String content,
        Instant publishedAt,
        Instant updatedAt
    ) {
        static PublicArticleResponse from(Article article) {
            return new PublicArticleResponse(
                article.getId(), article.getTitle(), article.getSlug(), article.getSummary(), article.getContent(),
                article.getPublishedAt(), article.getUpdatedAt()
            );
        }
    }
}
