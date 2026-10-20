package com.meikaappan.server.controller;

import com.meikaappan.server.entity.ModelEvaluationEntity;
import com.meikaappan.server.service.ModelEvaluationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/models")
public class ModelEvaluationController {

    private final ModelEvaluationService evaluationService;

    public ModelEvaluationController(ModelEvaluationService evaluationService) {
        this.evaluationService = evaluationService;
    }

    @GetMapping("/evaluation")
    public ResponseEntity<ModelEvaluationEntity> getEvaluation() {
        return ResponseEntity.ok(evaluationService.getEvaluation());
    }
}
