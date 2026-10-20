package com.meikaappan.server.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "device_findings")
public class DeviceFindingEntity {

    @Id
    private String id;

    @Column(name = "device_id", nullable = false)
    @JsonProperty("deviceId")
    private String deviceId;

    @Column(name = "title", nullable = false)
    @JsonProperty("appOrSettingName")
    private String appOrSettingName;

    @Column
    @JsonProperty("packageName")
    private String packageName;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String severity;

    @Column(name = "detected_at", nullable = false)
    @JsonProperty("detectionTimestamp")
    private Instant detectionTimestamp = Instant.now();

    @JsonProperty("evidenceSource")
    private String evidenceSource = "ANDROID_CLIENT_SIMULATOR";

    @Column(name = "description", nullable = false)
    @JsonProperty("explanation")
    private String explanation;

    @Column(name = "remediation", nullable = false)
    @JsonProperty("recommendedRemediation")
    private String recommendedRemediation;

    @Column(name = "review_status", nullable = false)
    @JsonProperty("reviewStatus")
    private String reviewStatus = "UNRESOLVED";

    @Column(name = "risk_weight", nullable = false)
    private Integer riskWeight = 25;

    public DeviceFindingEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

    public String getAppOrSettingName() { return appOrSettingName; }
    public void setAppOrSettingName(String appOrSettingName) { this.appOrSettingName = appOrSettingName; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public Instant getDetectionTimestamp() { return detectionTimestamp; }
    public void setDetectionTimestamp(Instant detectionTimestamp) { this.detectionTimestamp = detectionTimestamp; }

    public String getEvidenceSource() { return evidenceSource; }
    public void setEvidenceSource(String evidenceSource) { this.evidenceSource = evidenceSource; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getRecommendedRemediation() { return recommendedRemediation; }
    public void setRecommendedRemediation(String recommendedRemediation) { this.recommendedRemediation = recommendedRemediation; }

    public String getReviewStatus() { return reviewStatus; }
    public void setReviewStatus(String reviewStatus) { this.reviewStatus = reviewStatus; }

    public Integer getRiskWeight() { return riskWeight; }
    public void setRiskWeight(Integer riskWeight) { this.riskWeight = riskWeight; }
}
