package com.readmeister.app.dto;



public class UserDTO {
    private String name;
    private String username;
    private String email;
    private String avatarUrl;

    public UserDTO(String name, String username, String email, String avatarUrl) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }

    // getters and setters
    public String getName() { return name; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getAvatarUrl() { return avatarUrl; }

    public void setName(String name) { this.name = name; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
