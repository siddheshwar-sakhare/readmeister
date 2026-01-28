//package com.readmeister.app.controller;
//
//import com.readmeister.app.model.Document;
//import com.readmeister.app.repository.DocumentRepository;
//import com.readmeister.app.service.GeminiService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/readme")
//@RequiredArgsConstructor
//public class ReadmeController {
//
//    @Autowired
//    private  GeminiService geminiService;
//
//    @Autowired
//    private  DocumentRepository documentRepository;
//
//    // 1️⃣ Generate README AI output
//    @PostMapping("/generate")
//    public String generateReadme(@RequestParam String projectName,
//                                 @RequestParam String description) {
//        return geminiService.generateReadme(projectName, description);
//    }
//
//    // 2️⃣ Save README to MongoDB
//    @PostMapping("/save")
//    public Document saveReadme(@RequestParam String projectName,
//                               @RequestParam String description,
//                               @RequestParam String content,
//                               @AuthenticationPrincipal OAuth2User principal) {
//        String userId = principal.getAttribute("login");
//
//        Document doc = new Document();
//        doc.setTitle(projectName);
//        doc.setDescription(description);
//        doc.setContent(content);
//        doc.setUserId(userId);
//
//        return documentRepository.save(doc);
//    }
//}
