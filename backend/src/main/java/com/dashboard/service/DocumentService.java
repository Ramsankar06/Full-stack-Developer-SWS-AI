package com.dashboard.service;

import com.dashboard.entity.Document;
import com.dashboard.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Stream;

@Service
public class DocumentService {

    private final Path fileStorageLocation;
    private final DocumentRepository documentRepository;
    private final Map<Long, Document> localDocuments = new ConcurrentHashMap<>();
    private final AtomicLong localIdSequence = new AtomicLong(1);

    @Autowired
    public DocumentService(@Value("${file.upload-dir}") String uploadDir, DocumentRepository documentRepository) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.documentRepository = documentRepository;

        try {
            Files.createDirectories(this.fileStorageLocation);
            loadLocalDocuments();
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public Document storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }
            if (!fileName.toLowerCase().endsWith(".pdf")) {
                throw new RuntimeException("Only PDF files are allowed!");
            }

            // Make sure the file name is unique or just overwrite. For simple implementation, let's use original filename
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            Document document = new Document(fileName, file.getSize(), targetLocation.toString(), LocalDateTime.now());
            try {
                return documentRepository.save(document);
            } catch (RuntimeException ex) {
                return saveLocalDocument(document);
            }

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public List<Document> getAllDocuments() {
        try {
            return documentRepository.findAll();
        } catch (RuntimeException ex) {
            return localDocuments.values().stream()
                    .sorted(Comparator.comparing(Document::getUploadedAt).reversed())
                    .toList();
        }
    }
    
    public Path getFilePath(String fileName) {
        return this.fileStorageLocation.resolve(fileName).normalize();
    }
    
    public Document getDocumentById(Long id) {
        try {
            return documentRepository.findById(id).orElseThrow(() -> new RuntimeException("Document not found with id " + id));
        } catch (RuntimeException ex) {
            Document document = localDocuments.get(id);
            if (document == null) {
                throw new RuntimeException("Document not found with id " + id);
            }
            return document;
        }
    }

    private Document saveLocalDocument(Document document) {
        long id = localIdSequence.getAndIncrement();
        document.setId(id);
        localDocuments.put(id, document);
        return document;
    }

    private void loadLocalDocuments() throws IOException {
        if (!Files.exists(fileStorageLocation)) {
            return;
        }

        List<Document> documents = new ArrayList<>();
        try (Stream<Path> paths = Files.list(fileStorageLocation)) {
            paths.filter(Files::isRegularFile)
                    .filter(path -> path.getFileName().toString().toLowerCase().endsWith(".pdf"))
                    .forEach(path -> {
                        try {
                            documents.add(new Document(
                                    path.getFileName().toString(),
                                    Files.size(path),
                                    path.toString(),
                                    Files.getLastModifiedTime(path).toInstant()
                                            .atZone(java.time.ZoneId.systemDefault())
                                            .toLocalDateTime()
                            ));
                        } catch (IOException ignored) {
                            // Ignore unreadable files so one bad upload does not break the dashboard.
                        }
                    });
        }

        documents.stream()
                .sorted(Comparator.comparing(Document::getUploadedAt))
                .forEach(this::saveLocalDocument);
    }
}
