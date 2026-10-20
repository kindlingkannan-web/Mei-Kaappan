package com.meikaappan.server.repository;

import com.meikaappan.server.entity.DeviceInfoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceInfoRepository extends JpaRepository<DeviceInfoEntity, String> {
    Optional<DeviceInfoEntity> findFirstByOrderByIdAsc();
}
