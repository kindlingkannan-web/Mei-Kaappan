package com.meikaappan.server.service;

import com.meikaappan.server.entity.UserProfileEntity;
import com.meikaappan.server.repository.UserProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;

@Service
@Transactional
public class UserService {

    private final UserProfileRepository userRepository;

    public UserService(UserProfileRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileEntity getCurrentUser() {
        return userRepository.findFirstByOrderByIdAsc()
                .orElseGet(() -> userRepository.save(new UserProfileEntity(
                        "usr_demo_101", "Ramesh Sundaram", "ramesh.sundaram@demo.meikaappan.org",
                        "+91 98765 43210", true, "DEMO_USER", "dev_demo_01"
                )));
    }

    public UserProfileEntity updateCurrentUser(Map<String, Object> updates) {
        UserProfileEntity user = getCurrentUser();
        if (updates.containsKey("name") && updates.get("name") != null) {
            user.setName(String.valueOf(updates.get("name")));
        }
        if (updates.containsKey("email") && updates.get("email") != null) {
            user.setEmail(String.valueOf(updates.get("email")));
        }
        if (updates.containsKey("phone") && updates.get("phone") != null) {
            user.setPhone(String.valueOf(updates.get("phone")));
        }
        if (updates.containsKey("guardianEnabled") && updates.get("guardianEnabled") != null) {
            user.setGuardianModeEnabled(Boolean.valueOf(String.valueOf(updates.get("guardianEnabled"))));
        }
        user.setUpdatedAt(Instant.now());
        return userRepository.save(user);
    }
}
