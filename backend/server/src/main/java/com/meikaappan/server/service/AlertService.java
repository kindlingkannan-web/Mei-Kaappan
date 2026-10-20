package com.meikaappan.server.service;

import com.meikaappan.server.entity.AlertEntity;
import com.meikaappan.server.repository.AlertRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    public List<AlertEntity> getAllAlerts() {
        return alertRepository.findByOrderByTimestampDesc();
    }

    public Optional<AlertEntity> markAsRead(String id) {
        return alertRepository.findById(id).map(a -> {
            a.setIsRead(true);
            return alertRepository.save(a);
        });
    }

    public Optional<AlertEntity> acknowledge(String id) {
        return alertRepository.findById(id).map(a -> {
            a.setIsAcknowledged(true);
            a.setIsRead(true);
            return alertRepository.save(a);
        });
    }

    public Optional<AlertEntity> resolve(String id, String resolution) {
        return alertRepository.findById(id).map(a -> {
            a.setResolutionStatus(resolution);
            a.setIsAcknowledged(true);
            a.setIsRead(true);
            return alertRepository.save(a);
        });
    }

    public AlertEntity createAlert(AlertEntity alert) {
        if (alert.getId() == null || alert.getId().trim().isEmpty()) {
            alert.setId("alt_" + System.currentTimeMillis());
        }
        if (alert.getTimestamp() == null) {
            alert.setTimestamp(Instant.now());
        }
        return alertRepository.save(alert);
    }
}
