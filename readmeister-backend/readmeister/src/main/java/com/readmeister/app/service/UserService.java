package com.readmeister.app.service;

import com.readmeister.app.model.User;
import com.readmeister.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createOrUpdateUser(
            String userId,
            String username,
            String accessToken,
            String image,
            Integer projectCount
    ) {

        return userRepository.findByUserId(userId)
                .map(existing -> {
                    existing.setAccessToken(accessToken);
                    if (image != null) existing.setImage(image);
                    if (projectCount != null) existing.setProjectCount(projectCount);
                    return userRepository.save(existing);
                })
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .userId(userId)
                                .username(username)
                                .accessToken(accessToken)
                                .image(image)
                                .projectCount(projectCount != null ? projectCount : 0)
                                .build()
                ));
    }
}
