package com.meikaappan.server.controller;

import com.meikaappan.server.entity.UserFeedbackEntity;
import com.meikaappan.server.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping
    public ResponseEntity<List<UserFeedbackEntity>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    @PostMapping
    public ResponseEntity<UserFeedbackEntity> submitFeedback(@RequestBody UserFeedbackEntity feedback) {
        return ResponseEntity.ok(feedbackService.submitFeedback(feedback));
    }
}
