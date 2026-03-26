package com.readmeister.app.service;

import org.springframework.ai.document.Document;
import org.springframework.ai.reader.TextReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.*;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
public class CodeIngestionService {

    private final VectorStore vectorStore;

    // Common binary/non-code files to ignore
    private static final List<String> IGNORED_EXTENSIONS = Arrays.asList(
            ".png", ".jpg", ".jpeg", ".gif", ".ico", ".pdf", ".class", ".jar", ".zip", ".tar", ".gz", ".mp4", ".svg", ".eot", ".woff", ".woff2", ".ttf", ".lock", ".map", ".min.js"
    );
    
    // Directories to skip completely
    private static final List<String> IGNORED_DIRS = Arrays.asList(
            "node_modules", "target", "dist", "build", ".git", ".idea", ".DS_Store", "logs", ".mvn", "public", ".github"
    );
    
    // Explicit massive text files to skip
    private static final List<String> IGNORED_FILES = Arrays.asList(
            "package-lock.json", "yarn.lock", "mvnw", "mvnw.cmd"
    );

    public CodeIngestionService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void ingestGithubRepo(String repoFullName, String githubToken) throws Exception {
        System.out.println("Starting ingestion for: " + repoFullName);

        // 1. Download the repo ZIP using GitHub API
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(githubToken);
        headers.set("Accept", "application/vnd.github.v3+json");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        String zipUrl = "https://api.github.com/repos/" + repoFullName + "/zipball";
        ResponseEntity<byte[]> response = restTemplate.exchange(zipUrl, HttpMethod.GET, entity, byte[].class);
        byte[] zipBytes = response.getBody();

        if (zipBytes == null) throw new RuntimeException("Failed to download repository.");

        // 2. Save ZIP locally and extract it
        Path tempDir = Files.createTempDirectory("readmeister_repo");
        File zipFile = new File(tempDir.toFile(), "repo.zip");
        Files.write(zipFile.toPath(), zipBytes);

        extractZip(zipFile.getPath(), tempDir.toString());

        // 3. Recursively read and process in small batches to save memory!
        List<Document> batch = new ArrayList<>();
        // Doubled chunk size to 2000 to drastically cut down embedding time!
        TokenTextSplitter textSplitter = new TokenTextSplitter(2000, 200, 5, 10000, true);

        Files.walkFileTree(tempDir, new SimpleFileVisitor<Path>() {
            
            @Override
            public FileVisitResult preVisitDirectory(Path dir, BasicFileAttributes attrs) {
                if (IGNORED_DIRS.contains(dir.toFile().getName())) {
                    return FileVisitResult.SKIP_SUBTREE;
                }
                return FileVisitResult.CONTINUE;
            }

            @Override
            public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                File f = file.toFile();
                if (!f.isDirectory() && isValidTextFile(f.getName()) && !IGNORED_FILES.contains(f.getName())) {
                    try {
                        TextReader textReader = new TextReader(new FileSystemResource(f));
                        List<Document> docs = textReader.get();
                        for (Document doc : docs) {
                            doc.getMetadata().put("file_name", f.getName());
                            doc.getMetadata().put("file_path", f.getAbsolutePath().replace(tempDir.toString(), ""));
                        }
                        batch.addAll(docs);
                        
                        // Process in batches of 20 documents to prevent Java Heap OutOfMemoryError
                        if (batch.size() >= 20) {
                            System.out.println("Processing embedding batch of 20 documents...");
                            vectorStore.add(textSplitter.apply(batch));
                            batch.clear(); // Free memory
                        }
                    } catch (Exception e) {
                        System.err.println("Skipped file (unreadable): " + f.getName());
                    }
                }
                return FileVisitResult.CONTINUE;
            }
        });

        // 4. Process any remaining documents in the final batch
        if (!batch.isEmpty()) {
            System.out.println("Processing final embedding batch...");
            vectorStore.add(textSplitter.apply(batch));
            batch.clear();
        }

        // 5. Cleanup
        deleteDirectory(tempDir.toFile());
        System.out.println("Ingestion completed.");
    }

    private boolean isValidTextFile(String fileName) {
        String lowerCaseName = fileName.toLowerCase();
        for (String ext : IGNORED_EXTENSIONS) {
            if (lowerCaseName.endsWith(ext)) return false;
        }
        return true;
    }

    private void extractZip(String zipFilePath, String destDirectory) throws IOException {
        File destDir = new File(destDirectory);
        byte[] buffer = new byte[1024];
        try (ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFilePath))) {
            ZipEntry zipEntry = zis.getNextEntry();
            while (zipEntry != null) {
                File newFile = newFile(destDir, zipEntry);
                if (zipEntry.isDirectory()) {
                    if (!newFile.isDirectory() && !newFile.mkdirs()) {
                        throw new IOException("Failed to create directory " + newFile);
                    }
                } else {
                    File parent = newFile.getParentFile();
                    if (!parent.isDirectory() && !parent.mkdirs()) {
                        throw new IOException("Failed to create directory " + parent);
                    }
                    try (FileOutputStream fos = new FileOutputStream(newFile)) {
                        int len;
                        while ((len = zis.read(buffer)) > 0) {
                            fos.write(buffer, 0, len);
                        }
                    }
                }
                zipEntry = zis.getNextEntry();
            }
            zis.closeEntry();
        }
    }

    private File newFile(File destinationDir, ZipEntry zipEntry) throws IOException {
        File destFile = new File(destinationDir, zipEntry.getName());
        String destDirPath = destinationDir.getCanonicalPath();
        String destFilePath = destFile.getCanonicalPath();
        if (!destFilePath.startsWith(destDirPath + File.separator)) {
            throw new IOException("Entry is outside of the target dir: " + zipEntry.getName());
        }
        return destFile;
    }

    private void deleteDirectory(File dir) {
        File[] files = dir.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    deleteDirectory(file);
                } else {
                    file.delete();
                }
            }
        }
        dir.delete();
    }
}
