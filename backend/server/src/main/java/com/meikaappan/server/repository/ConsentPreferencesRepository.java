package com.meikaappan.server.repository;

import com.meikaappan.server.entity.ConsentPreferencesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConsentPreferencesRepository extends JpaRepository<ConsentPreferencesEntity, String> {
    Optional<ConsentPreferencesEntity> findFirstByOrderByIdAsc();
}
