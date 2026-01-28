package com.readmeister.app.controller;

import com.readmeister.app.service.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.core.ParameterizedTypeReference;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
public class GitHubController {

    private final OAuth2AuthorizedClientService clientService;
    private final WebClient webClient;

    @Autowired
    private GeminiService geminiService;

    public GitHubController(OAuth2AuthorizedClientService clientService) {
        this.clientService = clientService;
        this.webClient = WebClient.builder().build();
    }

    @GetMapping("/api/github/repos")
    public List<Map> getRepos(OAuth2AuthenticationToken authentication) {

        OAuth2AuthorizedClient client =
                clientService.loadAuthorizedClient(
                        authentication.getAuthorizedClientRegistrationId(),
                        authentication.getName()
                );

        String accessToken = client.getAccessToken().getTokenValue();

        return webClient.get()
                .uri("https://api.github.com/user/repos")
                .headers(h -> h.setBearerAuth(accessToken))
                .retrieve()
                .bodyToFlux(Map.class)
                .collectList()
                .block();
    }


    @GetMapping("/api/github/repos/{owner}/{repo}/readme")
    public String getReadme(@PathVariable String owner,
                            @PathVariable String repo,
                            OAuth2AuthenticationToken auth) {

        OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
                auth.getAuthorizedClientRegistrationId(),
                auth.getName()
        );

        String token = client.getAccessToken().getTokenValue();

        Map<String, Object> response = webClient.get()
                .uri("https://api.github.com/repos/{owner}/{repo}/readme", owner, repo)
                .headers(h -> h.setBearerAuth(token))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        if (response != null && response.containsKey("content")) {
            String contentBase64 = ((String) response.get("content")).replaceAll("\\s+", "");
            return new String(Base64.getDecoder().decode(contentBase64));
        }
        return "";
    }

    // ---------------- NEW PUSH ENDPOINT ----------------
    @PutMapping("/api/github/repos/{owner}/{repo}/readme/push")
    public Map<String, Object> pushFile(
            @PathVariable String owner,
            @PathVariable String repo,
            @RequestBody Map<String, String> requestBody, // incoming JSON
            OAuth2AuthenticationToken auth
    ) {
        String path = requestBody.get("path");        // e.g., README.md
        String message = requestBody.get("message");  // commit message
        String content = requestBody.get("content");  // file content

        OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
                auth.getAuthorizedClientRegistrationId(),
                auth.getName()
        );

        String token = client.getAccessToken().getTokenValue();

        // 1️⃣ Check if file exists to get SHA
        Map<String, Object> existingFile = null;
        try {
            existingFile = webClient.get()
                    .uri("https://api.github.com/repos/{owner}/{repo}/contents/{path}", owner, repo, path)
                    .headers(h -> h.setBearerAuth(token))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();
        } catch (Exception ignored) {
            // File doesn't exist, we can create it
        }

        // 2️⃣ Prepare request body for GitHub API
        Map<String, Object> githubBody = new HashMap<>();
        githubBody.put("message", message);
        githubBody.put("content", Base64.getEncoder().encodeToString(content.getBytes()));
        if (existingFile != null && existingFile.containsKey("sha")) {
            githubBody.put("sha", existingFile.get("sha")); // required for updating existing file
        }

        // 3️⃣ Push (create or update) file
        Map<String, Object> response = webClient.put()
                .uri("https://api.github.com/repos/{owner}/{repo}/contents/{path}", owner, repo, path)
                .headers(h -> h.setBearerAuth(token))
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(githubBody)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        return response;
    }
    @PostMapping("/api/github/repos/{owner}/{repo}/generate")
    public ResponseEntity<String> generateReadme(
            @PathVariable String owner,
            @PathVariable String repo
    ) {
        String prompt = """
    Generate a clean, professional, production-ready README.md
    for a GitHub repository named "%s".

    Rules:
    - Return ONLY valid Markdown
    - Do NOT include explanations
    - Do NOT include placeholders like [your-name]
    - Infer reasonable tech stack if unknown
    - Keep it concise but complete
    
    Include sections:
    - Title
    - Short Description
    - Features
    - Tech Stack
 

    Start directly with "# %s"
    """.formatted(repo, repo);

        String readme = geminiService.generateText(prompt);

        return ResponseEntity.ok(readme.trim());
    }



}
