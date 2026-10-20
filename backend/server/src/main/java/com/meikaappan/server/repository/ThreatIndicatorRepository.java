package com.meikaappan.server.repository;

import com.meikaappan.server.entity.ThreatIndicatorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThreatIndicatorRepository extends JpaRepository<ThreatIndicatorEntity, String> {
    Optional<ThreatIndicatorEntity> findByValueIgnoreCase(String value);
    List<ThreatIndicatorEntity> findByOrderByLastReportedDesc();
}
