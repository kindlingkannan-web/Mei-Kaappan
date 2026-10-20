package com.meikaappan.server.repository;

import com.meikaappan.server.entity.ModelEvaluationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModelEvaluationRepository extends JpaRepository<ModelEvaluationEntity, String> {
    Optional<ModelEvaluationEntity> findFirstByOrderByEvaluatedAtDesc();
}
