package com.readmeister.app.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String userId;     // GitHub ID
    private String username;

    private int projectCount = 0;

    private String accessToken;
    private String image;

    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();


}
