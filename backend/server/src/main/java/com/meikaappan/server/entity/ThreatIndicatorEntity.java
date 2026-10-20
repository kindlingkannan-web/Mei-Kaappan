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
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "threat_indicators")
public class ThreatIndicatorEntity {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Id
    private String id;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false, unique = true)
    private String value;

    @Column(name = "category", nullable = false)
    @JsonProperty("category")
    private String category = "PHISHING";

    @Column(name = "reputation_status", nullable = false)
    @JsonProperty("reputationStatus")
    private String reputationStatus = "SUSPICIOUS";

    @Column(name = "confidence_score", nullable = false)
    @JsonProperty("confidence")
    private Double confidence = 0.85;

    @Column(name = "report_count", nullable = false)
    @JsonProperty("reportCount")
    private Integer reportCount = 1;

    @Column(name = "first_reported", nullable = false)
    @JsonProperty("firstReported")
    private Instant firstReported = Instant.now();

    @Column(name = "last_reported", nullable = false)
    @JsonProperty("lastReported")
    private Instant lastReported = Instant.now();

    @Column(columnDefinition = "TEXT")
    private String tags = "[]";

    @Column(name = "associated_scam_vector")
    @JsonProperty("associatedScamVector")
    private String associatedScamVector;

    @Column(name = "normalized_value")
    @JsonProperty("normalizedValue")
    private String normalizedValue;

    @Column(name = "evidence_quality")
    @JsonProperty("evidenceQuality")
    private String evidenceQuality = "HIGH_OFFICIAL";

    @Column(name = "source_type")
    @JsonProperty("sourceType")
    private String sourceType = "COMMUNITY_REPORT";

    @Column(name = "review_status")
    @JsonProperty("reviewStatus")
    private String reviewStatus = "VERIFIED";

    @Transient
    @JsonProperty("tags")
    private List<String> tagList;

    @Transient
    @JsonProperty("relatedIncidentIds")
    private List<String> relatedIncidentIds = new ArrayList<>();

    public ThreatIndicatorEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; this.normalizedValue = value; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getReputationStatus() { return reputationStatus; }
    public void setReputationStatus(String reputationStatus) { this.reputationStatus = reputationStatus; }

    public Double getConfidence() { return confidence; }
    public void setConfidence(Double confidence) { this.confidence = confidence; }

    public Integer getReportCount() { return reportCount; }
    public void setReportCount(Integer reportCount) { this.reportCount = reportCount; }

    public Instant getFirstReported() { return firstReported; }
    public void setFirstReported(Instant firstReported) { this.firstReported = firstReported; }

    public Instant getLastReported() { return lastReported; }
    public void setLastReported(Instant lastReported) { this.lastReported = lastReported; }

    @com.fasterxml.jackson.annotation.JsonIgnore
    public String getTags() { return tags; }
    public void setTags(String tags) {
        this.tags = tags;
        try {
            this.tagList = MAPPER.readValue(tags, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            this.tagList = new ArrayList<>();
        }
    }

    public List<String> getTagList() {
        if (tagList == null) {
            try {
                tagList = MAPPER.readValue(tags != null ? tags : "[]", new TypeReference<List<String>>() {});
            } catch (Exception e) {
                tagList = new ArrayList<>();
            }
        }
        return tagList;
    }

    public void setTagList(List<String> tagList) {
        this.tagList = tagList;
        try {
            this.tags = MAPPER.writeValueAsString(tagList);
        } catch (Exception e) {
            this.tags = "[]";
        }
    }

    public String getAssociatedScamVector() { return associatedScamVector; }
    public void setAssociatedScamVector(String associatedScamVector) { this.associatedScamVector = associatedScamVector; }

    public String getNormalizedValue() { return normalizedValue != null ? normalizedValue : value; }
    public void setNormalizedValue(String normalizedValue) { this.normalizedValue = normalizedValue; }

    public String getEvidenceQuality() { return evidenceQuality; }
    public void setEvidenceQuality(String evidenceQuality) { this.evidenceQuality = evidenceQuality; }

    public String getSourceType() { return sourceType; }
    public void setSourceType(String sourceType) { this.sourceType = sourceType; }

    public String getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(String reviewStatus) { this.reviewStatus = reviewStatus; }

    public List<String> getRelatedIncidentIds() { return relatedIncidentIds; }
    public void setRelatedIncidentIds(List<String> relatedIncidentIds) { this.relatedIncidentIds = relatedIncidentIds; }
}
