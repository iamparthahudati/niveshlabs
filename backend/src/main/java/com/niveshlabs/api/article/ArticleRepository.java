package com.niveshlabs.api.article;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findAllByOrderByUpdatedAtDesc();
    List<Article> findAllByStatusOrderByPublishedAtDesc(String status);
    Optional<Article> findBySlugAndStatus(String slug, String status);
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, Long id);
}
