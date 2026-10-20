package com.meikaappan.server.repository;

import com.meikaappan.server.entity.IncidentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<IncidentEntity, String> {
    List<IncidentEntity> findByOrderByUpdatedAtDesc();
    List<IncidentEntity> findBySeverity(String severity);
}
