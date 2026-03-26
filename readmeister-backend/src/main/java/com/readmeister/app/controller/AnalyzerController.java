package com.readmeister.app.controller;

import com.readmeister.app.service.CodeIngestionService;
import com.readmeister.app.service.RepositoryAnalyzerService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analyze")
public class AnalyzerController {

    private final RepositoryAnalyzerService analyzerService;
    private final CodeIngestionService ingestionService;
    private final OAuth2AuthorizedClientService clientService;

    public AnalyzerController(RepositoryAnalyzerService analyzerService, CodeIngestionService ingestionService, OAuth2AuthorizedClientService clientService) {
        this.analyzerService = analyzerService;
        this.ingestionService = ingestionService;
        this.clientService = clientService;
    }

    @PostMapping("/ingest")
    public ResponseEntity<String> ingestRepo(@RequestBody Map<String, String> payload, OAuth2AuthenticationToken auth) {
        try {
            String repoFullName = payload.get("repoFullName");
            
            OAuth2AuthorizedClient client = clientService.loadAuthorizedClient(
                    auth.getAuthorizedClientRegistrationId(),
                    auth.getName()
            );
            String githubToken = client.getAccessToken().getTokenValue();

            ingestionService.ingestGithubRepo(repoFullName, githubToken);
            return ResponseEntity.ok("Repository downloaded and ingested into AI Vector Store successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Failed to ingest repository: " + e.getMessage());
        }
    }

    @GetMapping("/generate-overview")
    public ResponseEntity<String> generateOverview() {
        String analysisResult = analyzerService.analyzeRepository();
        return ResponseEntity.ok(analysisResult);
    }

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody Map<String, String> payload) {
        String question = payload.get("question");
        if (question == null || question.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Question cannot be empty");
        }
        try {
            String answer = analyzerService.chatWithRepository(question);
            return ResponseEntity.ok(answer);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Chat failed: " + e.getMessage());
        }
    }
}
