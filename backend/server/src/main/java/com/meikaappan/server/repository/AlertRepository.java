package com.meikaappan.server.repository;

import com.meikaappan.server.entity.AlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<AlertEntity, String> {
    List<AlertEntity> findByOrderByTimestampDesc();
}
