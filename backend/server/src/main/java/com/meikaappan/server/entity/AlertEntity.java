package com.meikaappan.server.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "alerts")
public class AlertEntity {

    @Id
    private String id;

    @Column(name = "incident_id")
    @JsonProperty("incidentId")
    private String incidentId;

    @Column(nullable = false)
    private String title;

    @Column(name = "message", nullable = false)
    @JsonProperty("summary")
    private String summary;

    @Column(nullable = false)
    private String severity;

    @Column(name = "channel", nullable = false)
    @JsonProperty("alertSource")
    private String alertSource = "SCAM_JOURNEY_ENGINE";

    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    @Column(name = "is_read", nullable = false)
    @JsonProperty("isRead")
    private Boolean isRead = false;

    @Column(name = "is_acknowledged", nullable = false)
    @JsonProperty("isAcknowledged")
    private Boolean isAcknowledged = false;

    @Column(name = "resolution_status", nullable = false)
    @JsonProperty("resolutionStatus")
    private String resolutionStatus = "UNRESOLVED";

    @Column(name = "action_url")
    private String actionUrl;

    @Column(name = "guardian_notified")
    @JsonProperty("guardianNotified")
    private Boolean guardianNotified = false;

    @Column(name = "guardian_acknowledged")
    @JsonProperty("guardianAcknowledged")
    private Boolean guardianAcknowledged = false;

    public AlertEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getIncidentId() { return incidentId; }
    public void setIncidentId(String incidentId) { this.incidentId = incidentId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getAlertSource() { return alertSource; }
    public void setAlertSource(String alertSource) { this.alertSource = alertSource; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }

    public Boolean getIsAcknowledged() { return isAcknowledged; }
    public void setIsAcknowledged(Boolean isAcknowledged) { this.isAcknowledged = isAcknowledged; }

    public String getResolutionStatus() { return resolutionStatus; }
    public void setResolutionStatus(String resolutionStatus) { this.resolutionStatus = resolutionStatus; }

    public String getActionUrl() { return actionUrl; }
    public void setActionUrl(String actionUrl) { this.actionUrl = actionUrl; }

    public Boolean getGuardianNotified() { return guardianNotified; }
    public void setGuardianNotified(Boolean guardianNotified) { this.guardianNotified = guardianNotified; }

    public Boolean getGuardianAcknowledged() { return guardianAcknowledged; }
    public void setGuardianAcknowledged(Boolean guardianAcknowledged) { this.guardianAcknowledged = guardianAcknowledged; }
}
