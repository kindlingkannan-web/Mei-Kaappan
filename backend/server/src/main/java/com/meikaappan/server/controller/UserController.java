package com.meikaappan.server.controller;

import com.meikaappan.server.entity.UserProfileEntity;
import com.meikaappan.server.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileEntity> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }

    @PatchMapping("/me")
    public ResponseEntity<UserProfileEntity> updateCurrentUser(@RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(userService.updateCurrentUser(updates));
    }
}
