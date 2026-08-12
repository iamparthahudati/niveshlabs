package com.niveshlabs.api.health;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class HealthControllerTest {

    @Test
    void reportsTheApiAsAvailable() {
        var response = new HealthController().health();

        assertThat(response.application()).isEqualTo("NiveshLabs API");
        assertThat(response.status()).isEqualTo("UP");
        assertThat(response.checkedAt()).isNotNull();
    }
}
