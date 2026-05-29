package com.dashboard.service;

import com.dashboard.entity.Notification;
import com.dashboard.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Comparator;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final Map<Long, Notification> localNotifications = new ConcurrentHashMap<>();
    private final AtomicLong localIdSequence = new AtomicLong(1);

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Notification createNotification(String message, String type) {
        Notification notification = new Notification(message, type, LocalDateTime.now());
        Notification savedNotification;
        try {
            savedNotification = notificationRepository.save(notification);
        } catch (RuntimeException ex) {
            savedNotification = saveLocalNotification(notification);
        }
        
        // Send real-time event
        messagingTemplate.convertAndSend("/topic/notifications", savedNotification);
        
        return savedNotification;
    }

    public List<Notification> getAllNotifications() {
        try {
            List<Notification> notifications = notificationRepository.findAllByOrderByCreatedAtDesc();
            if (!notifications.isEmpty() || localNotifications.isEmpty()) {
                return notifications;
            }
        } catch (RuntimeException ex) {
        }
        return localNotifications.values().stream()
                .sorted(Comparator.comparing(Notification::getCreatedAt).reversed())
                .toList();
    }

    public Notification markAsRead(Long id) {
        try {
            Notification notification = notificationRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Notification not found with id " + id));
            notification.setIsRead(true);
            return notificationRepository.save(notification);
        } catch (RuntimeException ex) {
            Notification notification = localNotifications.get(id);
            if (notification == null) {
                throw new RuntimeException("Notification not found with id " + id);
            }
            notification.setIsRead(true);
            return notification;
        }
    }

    public void markAllAsRead() {
        try {
            List<Notification> notifications = notificationRepository.findAll();
            notifications.forEach(n -> n.setIsRead(true));
            notificationRepository.saveAll(notifications);
        } catch (RuntimeException ex) {
            localNotifications.values().forEach(n -> n.setIsRead(true));
        }
    }

    private Notification saveLocalNotification(Notification notification) {
        long id = localIdSequence.getAndIncrement();
        notification.setId(id);
        localNotifications.put(id, notification);
        return notification;
    }
}
