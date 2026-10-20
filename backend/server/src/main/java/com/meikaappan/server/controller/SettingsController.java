package com.meikaappan.server.controller;

import com.meikaappan.server.entity.ConsentPreferencesEntity;
import com.meikaappan.server.service.SettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping("/consent")
    public ResponseEntity<ConsentPreferencesEntity> getConsent() {
        return ResponseEntity.ok(settingsService.getConsentPreferences());
    }

    @PatchMapping("/consent")
    public ResponseEntity<ConsentPreferencesEntity> updateConsent(@RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(settingsService.updateConsentPreferences(updates));
    }
}
