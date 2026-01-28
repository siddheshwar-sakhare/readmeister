package com.readmeister.app.controller;

import com.readmeister.app.model.User;
import com.readmeister.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.*;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final OAuth2AuthorizedClientService clientService;
    private final UserRepository userRepository;

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) throws Exception {
        request.getSession().invalidate(); // invalidate session
        response.setStatus(HttpServletResponse.SC_OK);
    }
    @GetMapping("/oauth/github/success")
    public RedirectView githubLoginSuccess(
            @AuthenticationPrincipal OAuth2User principal,
            OAuth2AuthenticationToken auth
    ) {
        OAuth2AuthorizedClient client =
                clientService.loadAuthorizedClient(
                        auth.getAuthorizedClientRegistrationId(),
                        auth.getName()
                );

        String token = client.getAccessToken().getTokenValue();

        String githubId = principal.getAttribute("id").toString();
        String username = principal.getAttribute("login");
        String avatar = principal.getAttribute("avatar_url");

        User user = userRepository.findByUserId(githubId)
                .orElse(User.builder()
                        .userId(githubId)
                        .username(username)
                        .image(avatar)
                        .createdAt(Instant.now())
                        .build());

        user.setAccessToken(token);
        user.setUpdatedAt(Instant.now());
        userRepository.save(user);

        // ✅ REDIRECT to frontend
        return new RedirectView("http://localhost:5173/home?token=" + token);
    }
}
