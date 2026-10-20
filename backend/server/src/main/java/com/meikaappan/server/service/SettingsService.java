package com.meikaappan.server.service;

import com.meikaappan.server.entity.ConsentPreferencesEntity;
import com.meikaappan.server.repository.ConsentPreferencesRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;

@Service
@Transactional
public class SettingsService {

    private final ConsentPreferencesRepository preferencesRepository;

    public SettingsService(ConsentPreferencesRepository preferencesRepository) {
        this.preferencesRepository = preferencesRepository;
    }

    public ConsentPreferencesEntity getConsentPreferences() {
        return preferencesRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> preferencesRepository.save(new ConsentPreferencesEntity()));
    }

    public ConsentPreferencesEntity updateConsentPreferences(Map<String, Object> updates) {
        ConsentPreferencesEntity prefs = getConsentPreferences();
        if (updates.containsKey("shareThreatIntel")) {
            prefs.setShareThreatIntel(Boolean.valueOf(String.valueOf(updates.get("shareThreatIntel"))));
        }
        if (updates.containsKey("telemetryEnabled")) {
            prefs.setTelemetryEnabled(Boolean.valueOf(String.valueOf(updates.get("telemetryEnabled"))));
        }
        if (updates.containsKey("guardianSharingEnabled")) {
            prefs.setGuardianSharingEnabled(Boolean.valueOf(String.valueOf(updates.get("guardianSharingEnabled"))));
        }
        if (updates.containsKey("smsScanningConsent")) {
            prefs.setSmsScanningConsent(Boolean.valueOf(String.valueOf(updates.get("smsScanningConsent"))));
        }
        if (updates.containsKey("clipboardMonitoringConsent")) {
            prefs.setClipboardMonitoringConsent(Boolean.valueOf(String.valueOf(updates.get("clipboardMonitoringConsent"))));
        }
        if (updates.containsKey("shareCriticalAlertsOnly")) {
            prefs.setShareCriticalAlertsOnly(Boolean.valueOf(String.valueOf(updates.get("shareCriticalAlertsOnly"))));
        }
        if (updates.containsKey("simplifiedExplanations")) {
            prefs.setSimplifiedExplanations(Boolean.valueOf(String.valueOf(updates.get("simplifiedExplanations"))));
        }
        if (updates.containsKey("dataRetentionDays")) {
            try {
                prefs.setDataRetentionDays(Integer.valueOf(String.valueOf(updates.get("dataRetentionDays"))));
            } catch (NumberFormatException ignored) {}
        }
        if (updates.containsKey("allowAnonymousThreatReporting")) {
            prefs.setAllowAnonymousThreatReporting(Boolean.valueOf(String.valueOf(updates.get("allowAnonymousThreatReporting"))));
        }
        if (updates.containsKey("localRuleProcessingOnly")) {
            prefs.setLocalRuleProcessingOnly(Boolean.valueOf(String.valueOf(updates.get("localRuleProcessingOnly"))));
        }
        prefs.setUpdatedAt(Instant.now());
        return preferencesRepository.save(prefs);
    }
}
