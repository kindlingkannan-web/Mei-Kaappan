package com.meikaappan.server.controller;

import com.meikaappan.server.entity.IncidentEntity;
import com.meikaappan.server.service.IncidentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/incidents")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @GetMapping
    public ResponseEntity<List<IncidentEntity>> getAllIncidents() {
        return ResponseEntity.ok(incidentService.getAllIncidents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentEntity> getIncidentById(@PathVariable String id) {
        return incidentService.getIncidentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<IncidentEntity> createIncident(@RequestBody IncidentEntity incident) {
        return ResponseEntity.ok(incidentService.createIncident(incident));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentEntity> updateIncident(@PathVariable String id, @RequestBody IncidentEntity incident) {
        return ResponseEntity.ok(incidentService.updateIncident(id, incident));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentEntity> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "UNDER_INVESTIGATION");
        String notes = body.getOrDefault("notes", "");
        return ResponseEntity.ok(incidentService.updateStatus(id, status, notes));
    }
}
