package com.readmeister.app.controller;

import com.readmeister.app.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;


@RestController
public class UserController {

    @GetMapping("/api/user")
    public ResponseEntity<Map<String, String>> getUser(OAuth2AuthenticationToken auth) {
        if (auth == null) return ResponseEntity.status(401).body(null);

        Map<String, String> userData = new HashMap<>();
        userData.put("login", auth.getPrincipal().getAttribute("login"));
        userData.put("name", auth.getPrincipal().getAttribute("name")); // optional
        return ResponseEntity.ok(userData);
    }
    @GetMapping("/api/user2")
    public UserDTO getUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) return null;

        return new UserDTO(
                principal.getAttribute("name"),
                principal.getAttribute("login"),
                principal.getAttribute("email"),
                principal.getAttribute("avatar_url")
        );
    }

}
