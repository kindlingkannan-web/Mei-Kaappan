package com.meikaappan.server.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "consent_preferences")
public class ConsentPreferencesEntity {

    @Id
    private String id = "pref_01";

    @Column(name = "share_threat_intel", nullable = false)
    @JsonProperty("shareThreatIntel")
    private Boolean shareThreatIntel = true;

    @Column(name = "telemetry_enabled", nullable = false)
    @JsonProperty("telemetryEnabled")
    private Boolean telemetryEnabled = true;

    @Column(name = "guardian_alerts_enabled", nullable = false)
    @JsonProperty("guardianSharingEnabled")
    private Boolean guardianSharingEnabled = true;

    @Column(name = "sms_scanning_consent", nullable = false)
    @JsonProperty("smsScanningConsent")
    private Boolean smsScanningConsent = true;

    @Column(name = "clipboard_monitoring_consent", nullable = false)
    @JsonProperty("clipboardMonitoringConsent")
    private Boolean clipboardMonitoringConsent = false;

    @Column(name = "share_critical_alerts_only", nullable = false)
    @JsonProperty("shareCriticalAlertsOnly")
    private Boolean shareCriticalAlertsOnly = true;

    @Column(name = "data_retention_days", nullable = false)
    @JsonProperty("dataRetentionDays")
    private Integer dataRetentionDays = 30;

    @Column(name = "allow_anonymous_threat_reporting", nullable = false)
    @JsonProperty("allowAnonymousThreatReporting")
    private Boolean allowAnonymousThreatReporting = true;

    @Column(name = "local_rule_processing_only", nullable = false)
    @JsonProperty("localRuleProcessingOnly")
    private Boolean localRuleProcessingOnly = false;

    @Column(name = "simplified_explanations", nullable = false)
    @JsonProperty("simplifiedExplanations")
    private Boolean simplifiedExplanations = true;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public ConsentPreferencesEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Boolean getShareThreatIntel() { return shareThreatIntel; }
    public void setShareThreatIntel(Boolean shareThreatIntel) { this.shareThreatIntel = shareThreatIntel; }

    public Boolean getTelemetryEnabled() { return telemetryEnabled; }
    public void setTelemetryEnabled(Boolean telemetryEnabled) { this.telemetryEnabled = telemetryEnabled; }

    public Boolean getGuardianSharingEnabled() { return guardianSharingEnabled; }
    public void setGuardianSharingEnabled(Boolean guardianSharingEnabled) { this.guardianSharingEnabled = guardianSharingEnabled; }

    public Boolean getSmsScanningConsent() { return smsScanningConsent; }
    public void setSmsScanningConsent(Boolean smsScanningConsent) { this.smsScanningConsent = smsScanningConsent; }

    public Boolean getClipboardMonitoringConsent() { return clipboardMonitoringConsent; }
    public void setClipboardMonitoringConsent(Boolean clipboardMonitoringConsent) { this.clipboardMonitoringConsent = clipboardMonitoringConsent; }

    public Boolean getShareCriticalAlertsOnly() { return shareCriticalAlertsOnly; }
    public void setShareCriticalAlertsOnly(Boolean shareCriticalAlertsOnly) { this.shareCriticalAlertsOnly = shareCriticalAlertsOnly; }

    public Integer getDataRetentionDays() { return dataRetentionDays; }
    public void setDataRetentionDays(Integer dataRetentionDays) { this.dataRetentionDays = dataRetentionDays; }

    public Boolean getAllowAnonymousThreatReporting() { return allowAnonymousThreatReporting; }
    public void setAllowAnonymousThreatReporting(Boolean allowAnonymousThreatReporting) { this.allowAnonymousThreatReporting = allowAnonymousThreatReporting; }

    public Boolean getLocalRuleProcessingOnly() { return localRuleProcessingOnly; }
    public void setLocalRuleProcessingOnly(Boolean localRuleProcessingOnly) { this.localRuleProcessingOnly = localRuleProcessingOnly; }

    public Boolean getSimplifiedExplanations() { return simplifiedExplanations; }
    public void setSimplifiedExplanations(Boolean simplifiedExplanations) { this.simplifiedExplanations = simplifiedExplanations; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
