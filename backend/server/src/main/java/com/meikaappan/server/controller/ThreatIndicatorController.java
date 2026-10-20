package com.meikaappan.server.controller;

import com.meikaappan.server.entity.ThreatIndicatorEntity;
import com.meikaappan.server.service.ThreatIntelligenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/threat-intelligence")
public class ThreatIndicatorController {

    private final ThreatIntelligenceService threatService;

    public ThreatIndicatorController(ThreatIntelligenceService threatService) {
        this.threatService = threatService;
    }

    @GetMapping("/indicators")
    public ResponseEntity<List<ThreatIndicatorEntity>> getAllIndicators() {
        return ResponseEntity.ok(threatService.getAllIndicators());
    }

    @GetMapping("/indicators/lookup")
    public ResponseEntity<ThreatIndicatorEntity> lookupByValue(@RequestParam String value) {
        return threatService.lookupByValue(value)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/reports")
    public ResponseEntity<ThreatIndicatorEntity> submitReport(@RequestBody ThreatIndicatorEntity indicator) {
        return ResponseEntity.ok(threatService.submitReport(indicator));
    }
}
