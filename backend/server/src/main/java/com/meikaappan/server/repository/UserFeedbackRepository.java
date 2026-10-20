package com.meikaappan.server.repository;

import com.meikaappan.server.entity.UserFeedbackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserFeedbackRepository extends JpaRepository<UserFeedbackEntity, String> {
    List<UserFeedbackEntity> findByOrderByTimestampDesc();
}
