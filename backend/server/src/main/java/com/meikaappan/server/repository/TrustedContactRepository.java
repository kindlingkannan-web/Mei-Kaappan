package com.meikaappan.server.repository;

import com.meikaappan.server.entity.TrustedContactEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrustedContactRepository extends JpaRepository<TrustedContactEntity, String> {
    List<TrustedContactEntity> findByOrderByInvitedAtAsc();
}
