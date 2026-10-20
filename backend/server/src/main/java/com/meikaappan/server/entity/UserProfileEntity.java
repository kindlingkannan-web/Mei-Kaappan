package com.meikaappan.server.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "user_profiles")
public class UserProfileEntity {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    @JsonProperty("guardianEnabled")
    private Boolean guardianModeEnabled = false;

    @Column(nullable = false)
    private String role = "DEMO_USER";

    @JsonProperty("activeDeviceId")
    private String activeDeviceId = "dev_demo_01";

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public UserProfileEntity() {}

    public UserProfileEntity(String id, String name, String email, String phone, Boolean guardianModeEnabled, String role, String activeDeviceId) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.guardianModeEnabled = guardianModeEnabled;
        this.role = role;
        this.activeDeviceId = activeDeviceId;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Boolean getGuardianModeEnabled() { return guardianModeEnabled; }
    public void setGuardianModeEnabled(Boolean guardianModeEnabled) { this.guardianModeEnabled = guardianModeEnabled; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getActiveDeviceId() { return activeDeviceId; }
    public void setActiveDeviceId(String activeDeviceId) { this.activeDeviceId = activeDeviceId; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
