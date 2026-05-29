import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const uploadSingleFile = (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
    });
};

export const uploadBulkFiles = (files, onUploadProgress) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return api.post('/upload/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
    });
};

export const fetchDocuments = () => {
    return api.get('/documents');
};

export const fetchNotifications = () => {
    return api.get('/notifications');
};

export const markNotificationAsRead = (id) => {
    return api.put(`/notifications/${id}/read`);
};

export const markAllNotificationsAsRead = () => {
    return api.put('/notifications/read-all');
};

export default api;
