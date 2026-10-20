package com.meikaappan.server.service;

import com.meikaappan.server.entity.EvidenceEntity;
import com.meikaappan.server.repository.EvidenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;

    public EvidenceService(EvidenceRepository evidenceRepository) {
        this.evidenceRepository = evidenceRepository;
    }

    public Optional<EvidenceEntity> getEvidenceById(String id) {
        return evidenceRepository.findById(id);
    }

    public List<EvidenceEntity> getEvidenceForIncident(String incidentId) {
        return evidenceRepository.findByIncidentIdOrderByTimestampAsc(incidentId);
    }

    public EvidenceEntity addEvidence(EvidenceEntity evidence) {
        if (evidence.getId() == null || evidence.getId().trim().isEmpty()) {
            evidence.setId("ev_" + System.currentTimeMillis());
        }
        if (evidence.getTimestamp() == null) {
            evidence.setTimestamp(Instant.now());
        }
        return evidenceRepository.save(evidence);
    }
}
