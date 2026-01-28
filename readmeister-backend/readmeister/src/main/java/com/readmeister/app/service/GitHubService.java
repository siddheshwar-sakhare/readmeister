package com.readmeister.app.service;


import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GitHubService {

    private static final String GITHUB_REPOS_API =
            "https://api.github.com/user/repos";

    public String getRepos(String token) {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.set("Accept", "application/vnd.github+json");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response =
                restTemplate.exchange(
                        GITHUB_REPOS_API,
                        HttpMethod.GET,
                        entity,
                        String.class
                );

        return response.getBody();
    }
}
