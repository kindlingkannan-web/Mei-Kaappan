package com.meikaappan.server.service;

import com.meikaappan.server.entity.DeviceFindingEntity;
import com.meikaappan.server.entity.DeviceInfoEntity;
import com.meikaappan.server.repository.DeviceFindingRepository;
import com.meikaappan.server.repository.DeviceInfoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DeviceService {

    private final DeviceInfoRepository deviceInfoRepository;
    private final DeviceFindingRepository findingRepository;

    public DeviceService(DeviceInfoRepository deviceInfoRepository, DeviceFindingRepository findingRepository) {
        this.deviceInfoRepository = deviceInfoRepository;
        this.findingRepository = findingRepository;
    }

    public DeviceInfoEntity getDeviceInfo() {
        return deviceInfoRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> {
                    DeviceInfoEntity d = new DeviceInfoEntity();
                    d.setId("dev_demo_01");
                    d.setDeviceName("Samsung Galaxy S23 (Demo Android)");
                    d.setOsVersion("Android 14 (OneUI 6.1)");
                    return deviceInfoRepository.save(d);
                });
    }

    public List<DeviceFindingEntity> getDeviceFindings() {
        return findingRepository.findByOrderByDetectionTimestampDesc();
    }

    public Optional<DeviceFindingEntity> updateFindingStatus(String id, String status) {
        return findingRepository.findById(id).map(f -> {
            f.setReviewStatus(status);
            return findingRepository.save(f);
        });
    }

    public DeviceFindingEntity addFinding(DeviceFindingEntity finding) {
        if (finding.getId() == null || finding.getId().trim().isEmpty()) {
            finding.setId("df_" + System.currentTimeMillis());
        }
        if (finding.getDetectionTimestamp() == null) {
            finding.setDetectionTimestamp(Instant.now());
        }
        return findingRepository.save(finding);
    }
}
