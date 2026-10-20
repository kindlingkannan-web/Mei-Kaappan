package com.meikaappan.server.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "trusted_contacts")
public class TrustedContactEntity {

    @Id
    private String id;

    @Column(name = "name", nullable = false)
    @JsonProperty("contactName")
    private String contactName;

    @Column(nullable = false)
    private String relationship;

    @Column(name = "phone", nullable = false)
    @JsonProperty("contactPhone")
    private String contactPhone;

    @Column(nullable = true)
    private String email;

    @Column(name = "notification_channels")
    private String notificationChannels = "[\"SMS\", \"PUSH\"]";

    @Column(name = "consent_status", nullable = false)
    @JsonProperty("consentStatus")
    private String consentStatus = "PENDING";

    @Column(name = "invited_at", nullable = false)
    @JsonProperty("invitedAt")
    private Instant invitedAt = Instant.now();

    @JsonProperty("acceptedAt")
    private Instant acceptedAt;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary = false;

    @Column(name = "notify_on_critical", nullable = false)
    @JsonProperty("notifyOnCritical")
    private Boolean notifyOnCritical = true;

    @Column(name = "notify_on_high", nullable = false)
    @JsonProperty("notifyOnHigh")
    private Boolean notifyOnHigh = true;

    @JsonProperty("userId")
    private String userId = "usr_demo_101";

    public TrustedContactEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getContactName() { return contactName; }
    public void setContactName(String contactName) { this.contactName = contactName; }

    public String getRelationship() { return relationship; }
    public void setRelationship(String relationship) { this.relationship = relationship; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getNotificationChannels() { return notificationChannels; }
    public void setNotificationChannels(String notificationChannels) { this.notificationChannels = notificationChannels; }

    public String getConsentStatus() { return consentStatus; }
    public void setConsentStatus(String consentStatus) { this.consentStatus = consentStatus; }

    public Instant getInvitedAt() { return invitedAt; }
    public void setInvitedAt(Instant invitedAt) { this.invitedAt = invitedAt; }

    public Instant getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(Instant acceptedAt) { this.acceptedAt = acceptedAt; }

    public Boolean getNotifyOnCritical() { return notifyOnCritical; }
    public void setNotifyOnCritical(Boolean notifyOnCritical) { this.notifyOnCritical = notifyOnCritical; }

    public Boolean getNotifyOnHigh() { return notifyOnHigh; }
    public void setNotifyOnHigh(Boolean notifyOnHigh) { this.notifyOnHigh = notifyOnHigh; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
