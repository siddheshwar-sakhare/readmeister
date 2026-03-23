package com.readmeister.app.service; // adjust package as per your project

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String generateText(String prompt) {

        RestTemplate restTemplate = new RestTemplate();
        String url = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(url, entity, Map.class);

            Map<?, ?> responseBody = response.getBody();
            List<?> candidates = (List<?>) responseBody.get("candidates");

            Map<?, ?> content =
                    (Map<?, ?>) ((Map<?, ?>) candidates.get(0)).get("content");

            List<?> parts = (List<?>) content.get("parts");

            return parts.get(0).toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to generate README using Gemini AI";
        }
    }
}

