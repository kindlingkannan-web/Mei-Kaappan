package com.meikaappan.server.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "evidence_events")
public class EvidenceEntity {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Id
    private String id;

    @Column(name = "incident_id")
    @JsonProperty("incidentId")
    private String incidentId;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    @Column(nullable = false)
    private String severity = "HIGH";

    @Column(name = "risk_points", nullable = false)
    @JsonProperty("riskContribution")
    private Integer riskContribution = 25;

    @Column(nullable = false)
    private String source = "SMS_SCANNER";

    @Column(name = "heuristic_rule", nullable = false)
    private String heuristicRule = "GENERIC_HEURISTIC";

    @Column(name = "explanation", nullable = false)
    @JsonProperty("summary")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String payload = "{}";

    @Column
    @JsonProperty("confidence")
    private Double confidence = 0.95;

    @Column(name = "evidence_quality")
    @JsonProperty("evidenceQuality")
    private String evidenceQuality = "HIGH_VERIFIED";

    @Transient
    @JsonProperty("rawPayload")
    private String rawPayload;

    @Column(name = "normalized_value")
    @JsonProperty("normalizedValue")
    private String normalizedValue;

    @Transient
    @JsonProperty("extractedIndicators")
    private Map<String, Object> extractedIndicators = new HashMap<>();

    public EvidenceEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getIncidentId() { return incidentId; }
    public void setIncidentId(String incidentId) { this.incidentId = incidentId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Integer getRiskContribution() { return riskContribution; }
    public void setRiskContribution(Integer riskContribution) { this.riskContribution = riskContribution; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getHeuristicRule() { return heuristicRule; }
    public void setHeuristicRule(String heuristicRule) { this.heuristicRule = heuristicRule; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getPayload() { return payload; }
    public void setPayload(String payload) {
        this.payload = payload;
        try {
            Map<String, Object> map = MAPPER.readValue(payload, new TypeReference<Map<String, Object>>() {});
            if (map.containsKey("rawPayload")) {
                this.rawPayload = String.valueOf(map.get("rawPayload"));
            }
            if (map.containsKey("extractedIndicators")) {
                this.extractedIndicators = (Map<String, Object>) map.get("extractedIndicators");
            }
        } catch (Exception ignored) {}
    }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public String getEvidenceQuality() { return evidenceQuality; }
    public void setEvidenceQuality(String evidenceQuality) { this.evidenceQuality = evidenceQuality; }

    public String getRawPayload() {
        if (rawPayload == null && payload != null) {
            try {
                Map<String, Object> map = MAPPER.readValue(payload, new TypeReference<Map<String, Object>>() {});
                if (map.containsKey("rawPayload")) {
                    this.rawPayload = String.valueOf(map.get("rawPayload"));
                }
            } catch (Exception ignored) {}
        }
        return rawPayload != null ? rawPayload : "";
    }
    public void setRawPayload(String rawPayload) {
        this.rawPayload = rawPayload;
        syncPayloadJson();
    }

    public String getNormalizedValue() { return normalizedValue; }
    public void setNormalizedValue(String normalizedValue) { this.normalizedValue = normalizedValue; }

    public Map<String, Object> getExtractedIndicators() { return extractedIndicators; }
    public void setExtractedIndicators(Map<String, Object> extractedIndicators) {
        this.extractedIndicators = extractedIndicators;
        syncPayloadJson();
    }

    private void syncPayloadJson() {
        try {
            Map<String, Object> map = new HashMap<>();
            if (rawPayload != null) map.put("rawPayload", rawPayload);
            if (extractedIndicators != null) map.put("extractedIndicators", extractedIndicators);
            this.payload = MAPPER.writeValueAsString(map);
        } catch (Exception ignored) {}
    }
}
