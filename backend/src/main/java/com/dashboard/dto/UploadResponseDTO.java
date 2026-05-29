package com.dashboard.dto;

import com.dashboard.entity.Document;
import java.util.List;

public class UploadResponseDTO {
    private List<Document> documents;
    private String message;

    public UploadResponseDTO(List<Document> documents, String message) {
        this.documents = documents;
        this.message = message;
    }

    public List<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
