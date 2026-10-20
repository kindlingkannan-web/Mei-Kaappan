package com.meikaappan.server.controller;

import com.meikaappan.server.entity.AlertEntity;
import com.meikaappan.server.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<List<AlertEntity>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<AlertEntity> markAsRead(@PathVariable String id) {
        return alertService.markAsRead(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/acknowledge")
    public ResponseEntity<AlertEntity> acknowledge(@PathVariable String id) {
        return alertService.acknowledge(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/resolve")
    public ResponseEntity<AlertEntity> resolve(@PathVariable String id, @RequestBody(required = false) Map<String, String> body) {
        String resolution = (body != null && body.containsKey("resolution")) ? body.get("resolution") : "RESOLVED";
        return alertService.resolve(id, resolution)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
