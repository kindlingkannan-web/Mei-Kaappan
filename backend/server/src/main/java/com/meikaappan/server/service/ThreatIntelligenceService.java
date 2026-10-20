package com.meikaappan.server.service;

import com.meikaappan.server.entity.ThreatIndicatorEntity;
import com.meikaappan.server.repository.ThreatIndicatorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ThreatIntelligenceService {

    private final ThreatIndicatorRepository indicatorRepository;

    public ThreatIntelligenceService(ThreatIndicatorRepository indicatorRepository) {
        this.indicatorRepository = indicatorRepository;
    }

    public List<ThreatIndicatorEntity> getAllIndicators() {
        return indicatorRepository.findByOrderByLastReportedDesc();
    }

    public Optional<ThreatIndicatorEntity> lookupByValue(String value) {
        return indicatorRepository.findByValueIgnoreCase(value.trim());
    }

    public ThreatIndicatorEntity submitReport(ThreatIndicatorEntity indicator) {
        Optional<ThreatIndicatorEntity> existing = indicatorRepository.findByValueIgnoreCase(indicator.getValue().trim());
        if (existing.isPresent()) {
            ThreatIndicatorEntity ind = existing.get();
            ind.setReportCount(ind.getReportCount() + 1);
            ind.setLastReported(Instant.now());
            if (ind.getReportCount() > 5) {
                ind.setReputationStatus("MALICIOUS");
            }
            return indicatorRepository.save(ind);
        } else {
            if (indicator.getId() == null || indicator.getId().trim().isEmpty()) {
                indicator.setId("ind_" + System.currentTimeMillis());
            }
            indicator.setFirstReported(Instant.now());
            indicator.setLastReported(Instant.now());
            return indicatorRepository.save(indicator);
        }
    }
}
