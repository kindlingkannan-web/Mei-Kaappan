package com.meikaappan.server.controller;

import com.meikaappan.server.entity.EvidenceEntity;
import com.meikaappan.server.service.EvidenceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(EvidenceService evidenceService) {
        this.evidenceService = evidenceService;
    }

    @GetMapping("/evidence/{id}")
    public ResponseEntity<EvidenceEntity> getEvidenceById(@PathVariable String id) {
        return evidenceService.getEvidenceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/incidents/{incidentId}/evidence")
    public ResponseEntity<List<EvidenceEntity>> getEvidenceForIncident(@PathVariable String incidentId) {
        return ResponseEntity.ok(evidenceService.getEvidenceForIncident(incidentId));
    }

    @PostMapping("/evidence")
    public ResponseEntity<EvidenceEntity> addEvidence(@RequestBody EvidenceEntity evidence) {
        return ResponseEntity.ok(evidenceService.addEvidence(evidence));
    }
}
