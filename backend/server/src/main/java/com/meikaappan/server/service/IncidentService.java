package com.meikaappan.server.service;

import com.meikaappan.server.entity.IncidentEntity;
import com.meikaappan.server.repository.IncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public IncidentService(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    public List<IncidentEntity> getAllIncidents() {
        return incidentRepository.findByOrderByUpdatedAtDesc();
    }

    public Optional<IncidentEntity> getIncidentById(String id) {
        return incidentRepository.findById(id);
    }

    public IncidentEntity createIncident(IncidentEntity incident) {
        if (incident.getId() == null || incident.getId().trim().isEmpty()) {
            incident.setId("inc_" + System.currentTimeMillis());
        }
        if (incident.getCreatedAt() == null) {
            incident.setCreatedAt(Instant.now());
        }
        incident.setUpdatedAt(Instant.now());
        return incidentRepository.save(incident);
    }

    public IncidentEntity updateIncident(String id, IncidentEntity update) {
        IncidentEntity existing = incidentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found: " + id));

        if (update.getTitle() != null) existing.setTitle(update.getTitle());
        if (update.getSummary() != null) existing.setSummary(update.getSummary());
        if (update.getSeverity() != null) existing.setSeverity(update.getSeverity());
        if (update.getCurrentRiskScore() != null) existing.setCurrentRiskScore(update.getCurrentRiskScore());
        if (update.getStatus() != null) existing.setStatus(update.getStatus());
        if (update.getPrimaryAttackerVector() != null) existing.setPrimaryAttackerVector(update.getPrimaryAttackerVector());
        if (update.getEvidenceIds() != null) existing.setEvidenceIds(update.getEvidenceIds());
        if (update.getTimeline() != null) existing.setTimeline(update.getTimeline());
        if (update.getAuditLog() != null) existing.setAuditLog(update.getAuditLog());
        if (update.getLastAssessment() != null) existing.setLastAssessment(update.getLastAssessment());

        existing.setUpdatedAt(Instant.now());
        return incidentRepository.save(existing);
    }

    public IncidentEntity updateStatus(String id, String status, String notes) {
        IncidentEntity existing = incidentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Incident not found: " + id));

        existing.setStatus(status);
        existing.setUpdatedAt(Instant.now());
        return incidentRepository.save(existing);
    }
}
