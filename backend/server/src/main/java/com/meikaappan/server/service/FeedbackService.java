package com.meikaappan.server.service;

import com.meikaappan.server.entity.UserFeedbackEntity;
import com.meikaappan.server.repository.UserFeedbackRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
public class FeedbackService {

    private final UserFeedbackRepository feedbackRepository;

    public FeedbackService(UserFeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public List<UserFeedbackEntity> getAllFeedback() {
        return feedbackRepository.findByOrderByTimestampDesc();
    }

    public UserFeedbackEntity submitFeedback(UserFeedbackEntity feedback) {
        if (feedback.getId() == null || feedback.getId().trim().isEmpty()) {
            feedback.setId("fb_" + System.currentTimeMillis());
        }
        if (feedback.getTimestamp() == null) {
            feedback.setTimestamp(Instant.now());
        }
        return feedbackRepository.save(feedback);
    }
}
