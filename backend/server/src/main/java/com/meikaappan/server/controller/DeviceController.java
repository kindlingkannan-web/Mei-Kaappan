package com.meikaappan.server.controller;

import com.meikaappan.server.entity.DeviceFindingEntity;
import com.meikaappan.server.entity.DeviceInfoEntity;
import com.meikaappan.server.service.DeviceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/device")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping("/info")
    public ResponseEntity<DeviceInfoEntity> getDeviceInfo() {
        return ResponseEntity.ok(deviceService.getDeviceInfo());
    }

    @GetMapping("/findings")
    public ResponseEntity<List<DeviceFindingEntity>> getDeviceFindings() {
        return ResponseEntity.ok(deviceService.getDeviceFindings());
    }

    @PatchMapping("/findings/{id}/status")
    public ResponseEntity<DeviceFindingEntity> updateFindingStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "REMEDIATED");
        return deviceService.updateFindingStatus(id, status)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/findings")
    public ResponseEntity<DeviceFindingEntity> addFinding(@RequestBody DeviceFindingEntity finding) {
        return ResponseEntity.ok(deviceService.addFinding(finding));
    }
}
