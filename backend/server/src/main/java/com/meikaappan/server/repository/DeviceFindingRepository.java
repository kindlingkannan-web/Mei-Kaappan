package com.meikaappan.server.repository;

import com.meikaappan.server.entity.DeviceFindingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceFindingRepository extends JpaRepository<DeviceFindingEntity, String> {
    List<DeviceFindingEntity> findByOrderByDetectionTimestampDesc();
}
