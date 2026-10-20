package com.meikaappan.server.repository;

import com.meikaappan.server.entity.EvidenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvidenceRepository extends JpaRepository<EvidenceEntity, String> {
    List<EvidenceEntity> findByIncidentIdOrderByTimestampAsc(String incidentId);
    List<EvidenceEntity> findByIdIn(List<String> ids);
}
