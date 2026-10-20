package com.meikaappan.server.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "device_info")
public class DeviceInfoEntity {

    @Id
    private String id;

    @Column(name = "device_model", nullable = false)
    @JsonProperty("deviceName")
    private String deviceName;

    @Column(name = "os_version", nullable = false)
    @JsonProperty("osVersion")
    private String osVersion;

    @Column(name = "security_patch_level", nullable = false)
    @JsonProperty("platform")
    private String platform = "ANDROID";

    @Column(name = "last_audit_timestamp", nullable = false)
    @JsonProperty("lastScanTimestamp")
    private Instant lastScanTimestamp = Instant.now();

    @Column(name = "health_score", nullable = false)
    @JsonProperty("securityHealthScore")
    private Integer securityHealthScore = 42;

    @Column(name = "developer_options_enabled", nullable = false)
    private Boolean developerOptionsEnabled = false;

    @Column(name = "active_threat_count")
    @JsonProperty("activeThreatCount")
    private Integer activeThreatCount = 3;

    @Column(name = "unknown_sources_allowed", nullable = false)
    private Boolean unknownSourcesAllowed = true;

    @Column(name = "active_vpn_detected", nullable = false)
    private Boolean activeVpnDetected = false;

    @Column(name = "user_id")
    @JsonProperty("userId")
    private String userId = "usr_demo_101";

    public DeviceInfoEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDeviceName() { return deviceName; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }

    public String getOsVersion() { return osVersion; }
    public void setOsVersion(String osVersion) { this.osVersion = osVersion; }

    public String getPlatform() { return platform; }
    public void setPlatform(String platform) { this.platform = platform; }

    public Instant getLastScanTimestamp() { return lastScanTimestamp; }
    public void setLastScanTimestamp(Instant lastScanTimestamp) { this.lastScanTimestamp = lastScanTimestamp; }

    public Integer getSecurityHealthScore() { return securityHealthScore; }
    public void setSecurityHealthScore(Integer securityHealthScore) { this.securityHealthScore = securityHealthScore; }

    public Integer getActiveThreatCount() { return activeThreatCount; }
    public void setActiveThreatCount(Integer activeThreatCount) { this.activeThreatCount = activeThreatCount; }

    public Boolean getUnknownSourcesAllowed() { return unknownSourcesAllowed; }
    public void setUnknownSourcesAllowed(Boolean unknownSourcesAllowed) { this.unknownSourcesAllowed = unknownSourcesAllowed; }

    public Boolean getActiveVpnDetected() { return activeVpnDetected; }
    public void setActiveVpnDetected(Boolean activeVpnDetected) { this.activeVpnDetected = activeVpnDetected; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
