package com.meikaappan.server.controller;

import com.meikaappan.server.entity.TrustedContactEntity;
import com.meikaappan.server.service.GuardianService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/guardian")
public class GuardianController {

    private final GuardianService guardianService;

    public GuardianController(GuardianService guardianService) {
        this.guardianService = guardianService;
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<TrustedContactEntity>> getContacts() {
        return ResponseEntity.ok(guardianService.getTrustedContacts());
    }

    @PostMapping("/contacts")
    public ResponseEntity<TrustedContactEntity> addContact(@RequestBody TrustedContactEntity contact) {
        return ResponseEntity.ok(guardianService.addContact(contact));
    }

    @PatchMapping("/contacts/{id}/consent")
    public ResponseEntity<TrustedContactEntity> updateConsent(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "ACCEPTED");
        return guardianService.updateConsent(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<Void> removeContact(@PathVariable String id) {
        boolean removed = guardianService.removeContact(id);
        if (removed) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
