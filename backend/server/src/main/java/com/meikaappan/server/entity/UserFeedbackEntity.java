package com.meikaappan.server.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "user_feedbacks")
public class UserFeedbackEntity {

    @Id
    private String id;

    @Column(name = "target_id")
    @JsonProperty("targetId")
    private String targetId;

    @Column(name = "target_type")
    @JsonProperty("targetType")
    private String targetType = "INCIDENT";

    @Column(nullable = false)
    private Integer rating = 5;

    @Column(nullable = false)
    private Boolean helpful = true;

    @Column
    @JsonProperty("label")
    private String label = "CORRECT";

    @Column(name = "comments", columnDefinition = "TEXT")
    @JsonProperty("userComments")
    private String userComments;

    @Column(name = "user_action_taken")
    private String userActionTaken;

    @Column(nullable = false)
    private Instant timestamp = Instant.now();

    @Column(name = "submitted_by")
    @JsonProperty("submittedBy")
    private String submittedBy = "usr_demo_101";

    public UserFeedbackEntity() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }

    public String getTargetType() { return targetType; }
    public void setTargetType(String targetType) { this.targetType = targetType; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public Boolean getHelpful() { return helpful; }
    public void setHelpful(Boolean helpful) { this.helpful = helpful; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getUserComments() { return userComments; }
    public void setUserComments(String userComments) { this.userComments = userComments; }

    public String getUserActionTaken() { return userActionTaken; }
    public void setUserActionTaken(String userActionTaken) { this.userActionTaken = userActionTaken; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }

    public String getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(String submittedBy) { this.submittedBy = submittedBy; }
}
