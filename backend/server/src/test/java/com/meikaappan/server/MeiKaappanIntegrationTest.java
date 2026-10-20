package com.meikaappan.server;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meikaappan.server.entity.IncidentEntity;
import com.meikaappan.server.entity.ThreatIndicatorEntity;
import com.meikaappan.server.repository.IncidentRepository;
import com.meikaappan.server.repository.ThreatIndicatorRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class MeiKaappanIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private ThreatIndicatorRepository indicatorRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("End-to-End: Database migrations and seed data should be present in PostgreSQL")
    void testDatabaseMigrationAndSeedData() throws Exception {
        mockMvc.perform(get("/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("usr_demo_101"))
                .andExpect(jsonPath("$.name").value("Ramesh Sundaram"));

        mockMvc.perform(get("/incidents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(org.hamcrest.Matchers.greaterThanOrEqualTo(4)));
    }

    @Test
    @DisplayName("End-to-End Persistence: Create new incident, query it, update it, and verify in PostgreSQL")
    void testIncidentPersistenceLifecycle() throws Exception {
        String testId = "inc_test_" + System.currentTimeMillis();
        IncidentEntity newIncident = new IncidentEntity();
        newIncident.setId(testId);
        newIncident.setTitle("Live PostgreSQL Scam Test Incident");
        newIncident.setSummary("End-to-end verification of PostgreSQL persistence through Spring Boot REST API.");
        newIncident.setSeverity("HIGH");
        newIncident.setCurrentRiskScore(84);
        newIncident.setStatus("ACTIVE");
        newIncident.setPrimaryAttackerVector("SMS Phishing -> Compromised UPI");
        newIncident.setEvidenceIds(Collections.singletonList("ev_101"));

        // 1. POST /incidents
        mockMvc.perform(post("/incidents")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newIncident)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testId))
                .andExpect(jsonPath("$.currentRiskScore").value(84));

        // 2. Direct Repository Verification in PostgreSQL
        assertThat(incidentRepository.findById(testId)).isPresent();
        assertThat(incidentRepository.findById(testId).get().getTitle()).isEqualTo("Live PostgreSQL Scam Test Incident");

        // 3. GET /incidents/{id}
        mockMvc.perform(get("/incidents/" + testId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Live PostgreSQL Scam Test Incident"));

        // 4. PATCH /incidents/{id}/status to RESOLVED
        Map<String, String> statusUpdate = new HashMap<>();
        statusUpdate.put("status", "RESOLVED");
        statusUpdate.put("notes", "Scam verified and neutralized by user.");

        mockMvc.perform(patch("/incidents/" + testId + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(statusUpdate)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RESOLVED"));

        // 5. Final PostgreSQL check
        assertThat(incidentRepository.findById(testId).get().getStatus()).isEqualTo("RESOLVED");
    }

    @Test
    @DisplayName("End-to-End: Threat Intelligence indicator lookup and reporting")
    void testThreatIntelligenceEndpoints() throws Exception {
        mockMvc.perform(get("/threat-intelligence/indicators/lookup?value=electricity.billing.dept@okaxis"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reputationStatus").value("MALICIOUS"));

        ThreatIndicatorEntity newIndicator = new ThreatIndicatorEntity();
        newIndicator.setValue("new.phishing.alert@fakeupi");
        newIndicator.setType("UPI");
        newIndicator.setCategory("FRAUDULENT_VPA");
        newIndicator.setReputationStatus("MALICIOUS");

        mockMvc.perform(post("/threat-intelligence/reports")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newIndicator)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.value").value("new.phishing.alert@fakeupi"));

        assertThat(indicatorRepository.findByValueIgnoreCase("new.phishing.alert@fakeupi")).isPresent();
    }
}
