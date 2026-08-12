package com.niveshlabs.api.health;

import java.time.Instant;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public HealthResponse health() {
        return new HealthResponse("NiveshLabs API", "UP", Instant.now());
    }

    public record HealthResponse(String application, String status, Instant checkedAt) {}
}
