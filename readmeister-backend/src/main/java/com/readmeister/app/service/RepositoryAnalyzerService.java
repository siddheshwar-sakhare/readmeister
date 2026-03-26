package com.readmeister.app.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RepositoryAnalyzerService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    private static final String SYSTEM_PROMPT = """
            You are an expert software engineer and code analyst.

            Your task is to deeply understand a GitHub repository based on the provided code snippets and metadata.

            Instructions:

            1. Analyze the provided repository content carefully.
            2. Identify:
               - Tech stack (languages, frameworks, libraries)
               - Project structure (folders, layers, architecture)
               - Key functionalities (authentication, APIs, database, business logic)
               - Important components (controllers, services, configs, models)

            3. Based ONLY on the given context (code snippets), generate accurate and grounded output.
            4. DO NOT make assumptions if information is not present.
            5. If something is unclear, say "Not enough information available".

            Output format:

            1. Project Overview
               - What this project does

            2. Tech Stack
               - Languages, frameworks, tools used

            3. Architecture / Structure
               - Explain folder structure and flow

            4. Key Features
               - Main functionalities implemented

            5. API Endpoints (if applicable)
               - List endpoints with purpose

            6. Setup Instructions
               - Steps to run project locally

            7. Observations
               - Any improvements or notes

            Context:
            {context}
            """;

    public RepositoryAnalyzerService(ChatClient.Builder chatClientBuilder, VectorStore vectorStore) {
        this.chatClient = chatClientBuilder.build();
        this.vectorStore = vectorStore;
    }

    public String analyzeRepository() {
        // Retrieve the most relevant code chunks from Vector DB
        List<Document> similarDocuments = vectorStore.similaritySearch(
                SearchRequest.query("main application configuration UI backend endpoints dependencies")
                             .withTopK(10)
        );

        // Combine the retrieved code chunks into a single string for the {context}
        String retrievedContext = similarDocuments.stream()
                .map(Document::getContent)
                .collect(Collectors.joining("\n\n--- NEXT FILE ---\n\n"));

        // Inject the retrieved code into Prompt Template
        PromptTemplate promptTemplate = new PromptTemplate(SYSTEM_PROMPT);
        var prompt = promptTemplate.create(Map.of("context", retrievedContext));

        // Call the LLM (like OpenAI/Gemini) through Spring AI
        return chatClient.prompt(prompt)
                .call()
                .content();
    }

    public String chatWithRepository(String question) {
        // 1. Retrieve the most relevant code chunks for the SPECIFIC QUESTION
        List<Document> relevantDocs = vectorStore.similaritySearch(
                SearchRequest.query(question).withTopK(8) // Limit context window
        );

        // 2. Combine the retrieved code snippets
        StringBuilder context = new StringBuilder();
        for (Document doc : relevantDocs) {
            String fileName = (String) doc.getMetadata().getOrDefault("file_name", "Unknown File");
            context.append("--- BEGIN FILE: ").append(fileName).append(" ---\n");
            context.append(doc.getContent()).append("\n");
            context.append("--- END FILE ---\n\n");
        }

        // 3. User's specific prompt template
        String promptText = """
                You are a helpful AI assistant that answers questions about a GitHub repository.

                Rules:
                - Answer ONLY using the provided context.
                - If the answer is not in the context, say:
                  "I could not find this information in the repository."

                - Be concise and clear.
                - Explain in simple terms if needed.

                Context:
                %s

                Question:
                %s
                """.formatted(context.toString(), question);

        // 4. Generate the AI response
        return chatClient.prompt()
                .user(promptText)
                .call()
                .content();
    }
}
