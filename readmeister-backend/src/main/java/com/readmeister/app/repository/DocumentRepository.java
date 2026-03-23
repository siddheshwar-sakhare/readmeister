package com.readmeister.app.repository;

import com.readmeister.app.model.Document;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DocumentRepository extends MongoRepository<Document, String> {

    List<Document> findAllByUserId(String userId);
}
