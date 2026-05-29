package com.dashboard.controller;

import com.dashboard.entity.Document;
import com.dashboard.service.DocumentService;
import com.dashboard.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;
    private final NotificationService notificationService;

    @Autowired
    public DocumentController(DocumentService documentService, NotificationService notificationService) {
        this.documentService = documentService;
        this.notificationService = notificationService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            Document doc = documentService.storeFile(file);
            return ResponseEntity.ok(doc);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/upload/bulk")
    public ResponseEntity<?> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        try {
            List<Document> uploadedDocuments = new ArrayList<>();
            for (MultipartFile file : files) {
                uploadedDocuments.add(documentService.storeFile(file));
            }
            if (files.length > 3) {
                notificationService.createNotification(files.length + " files uploaded successfully", "SUCCESS");
            }
            return ResponseEntity.ok(uploadedDocuments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/documents")
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @GetMapping("/documents/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id);
            Path filePath = documentService.getFilePath(document.getFileName());
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read file: " + document.getFileName());
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("Could not read file", ex);
        }
    }
}
