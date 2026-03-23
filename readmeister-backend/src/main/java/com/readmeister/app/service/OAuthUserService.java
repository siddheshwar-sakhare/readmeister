package com.readmeister.app.service;

import com.readmeister.app.model.User;
import com.readmeister.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OAuthUserService {

    private final UserRepository userRepository;

    public User handleOAuthLogin(OAuth2AuthenticationToken authentication, String accessToken) {

        Map<String, Object> attributes = authentication.getPrincipal().getAttributes();

        String githubId = attributes.get("id").toString();
        String username = (String) attributes.get("login");
        String avatar = (String) attributes.get("avatar_url");

        return userRepository.findByUserId(githubId)
                .map(user -> {
                    user.setAccessToken(accessToken);
                    user.setImage(avatar);
                    return userRepository.save(user);
                })
                .orElseGet(() -> userRepository.save(
                        User.builder()
                                .userId(githubId)
                                .username(username)
                                .image(avatar)
                                .accessToken(accessToken)
                                .build()
                ));
    }
}
