package com.meikaappan.server.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "incidents")
public class IncidentEntity {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Id
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    @Column(nullable = false)
    private String severity = "HIGH";

    @Column(name = "current_risk_score", nullable = false)
    @JsonProperty("currentRiskScore")
    private Integer currentRiskScore = 75;

    @Column(nullable = false)
    private String status = "ACTIVE";

    @Column(name = "created_at", nullable = false)
    @JsonProperty("createdAt")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @JsonProperty("updatedAt")
    private Instant updatedAt = Instant.now();

    @Column(name = "primary_attacker_vector", nullable = false)
    @JsonProperty("primaryAttackerVector")
    private String primaryAttackerVector;

    @Column(name = "financial_exposure_amount")
    private BigDecimal financialExposureAmount = BigDecimal.ZERO;

    @Column(name = "target_asset")
    private String targetAsset;

    @Column(name = "explanation_narrative", columnDefinition = "TEXT")
    private String explanationNarrative;

    @Column(name = "evidence_ids", columnDefinition = "TEXT")
    private String evidenceIdsJson = "[]";

    @Column(name = "risk_breakdown", columnDefinition = "TEXT")
    private String riskBreakdownJson = "[]";

    @Column(name = "timeline", columnDefinition = "TEXT")
    private String timelineJson = "[]";

    @Column(name = "recommended_actions", columnDefinition = "TEXT")
    private String recommendedActionsJson = "[]";

    @Column(name = "user_id")
    @JsonProperty("userId")
    private String userId = "usr_demo_101";

    @Column(name = "category")
    @JsonProperty("category")
    private String category = "BANKING_KYC_IMPERSONATION";

    @Column(name = "assigned_analyst")
    @JsonProperty("assignedAnalyst")
    private String assignedAnalyst;

    @Transient
    @JsonProperty("evidenceIds")
    private List<String> evidenceIds = new ArrayList<>();

    @Transient
    @JsonProperty("timeline")
    private List<Map<String, Object>> timeline = new ArrayList<>();

    @Transient
    @JsonProperty("auditLog")
    private List<Map<String, Object>> auditLog = new ArrayList<>();

    @Transient
    @JsonProperty("lastAssessment")
    private Map<String, Object> lastAssessment = new HashMap<>();

    public IncidentEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Integer getCurrentRiskScore() { return currentRiskScore; }
    public void setCurrentRiskScore(Integer currentRiskScore) { this.currentRiskScore = currentRiskScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public String getPrimaryAttackerVector() { return primaryAttackerVector; }
    public void setPrimaryAttackerVector(String primaryAttackerVector) { this.primaryAttackerVector = primaryAttackerVector; }

    public BigDecimal getFinancialExposureAmount() { return financialExposureAmount; }
    public void setFinancialExposureAmount(BigDecimal financialExposureAmount) { this.financialExposureAmount = financialExposureAmount; }

    public String getTargetAsset() { return targetAsset; }
    public void setTargetAsset(String targetAsset) { this.targetAsset = targetAsset; }

    public String getExplanationNarrative() { return explanationNarrative; }
    public void setExplanationNarrative(String explanationNarrative) { this.explanationNarrative = explanationNarrative; }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public String getEvidenceIdsJson() { return evidenceIdsJson; }
    public void setEvidenceIdsJson(String evidenceIdsJson) {
        this.evidenceIdsJson = evidenceIdsJson;
        try {
            this.evidenceIds = MAPPER.readValue(evidenceIdsJson, new TypeReference<List<String>>() {});
        } catch (Exception ignored) {}
    }

    public List<String> getEvidenceIds() {
        if (evidenceIds == null || evidenceIds.isEmpty()) {
            try {
                evidenceIds = MAPPER.readValue(evidenceIdsJson != null ? evidenceIdsJson : "[]", new TypeReference<List<String>>() {});
            } catch (Exception ignored) {}
        }
        return evidenceIds != null ? evidenceIds : new ArrayList<>();
    }
    public void setEvidenceIds(List<String> evidenceIds) {
        this.evidenceIds = evidenceIds;
        try {
            this.evidenceIdsJson = MAPPER.writeValueAsString(evidenceIds);
        } catch (Exception ignored) {}
    }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public String getTimelineJson() { return timelineJson; }
    public void setTimelineJson(String timelineJson) {
        this.timelineJson = timelineJson;
        try {
            this.timeline = MAPPER.readValue(timelineJson, new TypeReference<List<Map<String, Object>>>() {});
        } catch (Exception ignored) {}
    }

    public List<Map<String, Object>> getTimeline() {
        if (timeline == null || timeline.isEmpty()) {
            try {
                timeline = MAPPER.readValue(timelineJson != null ? timelineJson : "[]", new TypeReference<List<Map<String, Object>>>() {});
            } catch (Exception ignored) {}
        }
        return timeline != null ? timeline : new ArrayList<>();
    }
    public void setTimeline(List<Map<String, Object>> timeline) {
        this.timeline = timeline;
        try {
            this.timelineJson = MAPPER.writeValueAsString(timeline);
        } catch (Exception ignored) {}
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getAssignedAnalyst() { return assignedAnalyst; }
    public void setAssignedAnalyst(String assignedAnalyst) { this.assignedAnalyst = assignedAnalyst; }

    public List<Map<String, Object>> getAuditLog() {
        if (auditLog == null) auditLog = new ArrayList<>();
        return auditLog;
    }
    public void setAuditLog(List<Map<String, Object>> auditLog) { this.auditLog = auditLog; }

    public Map<String, Object> getLastAssessment() {
        if (lastAssessment == null || lastAssessment.isEmpty()) {
            lastAssessment = new HashMap<>();
            lastAssessment.put("riskScore", currentRiskScore);
            lastAssessment.put("severity", severity);
            lastAssessment.put("classification", severity + " Scam Risk");
            lastAssessment.put("evidenceConsideredCount", getEvidenceIds().size());
            lastAssessment.put("positiveIndicators", new ArrayList<>());
            lastAssessment.put("reassuringIndicators", new ArrayList<>());
            lastAssessment.put("uncertaintyExplanation", "Continuous analysis based on observed multi-stage signals.");
            lastAssessment.put("recommendedNextSteps", new ArrayList<>());
            lastAssessment.put("timestamp", updatedAt.toString());
            lastAssessment.put("method", "COMBINED");
            lastAssessment.put("disclaimer", "Mei-Kaappan automated heuristic evaluation.");
        }
        return lastAssessment;
    }
    public void setLastAssessment(Map<String, Object> lastAssessment) { this.lastAssessment = lastAssessment; }
}
