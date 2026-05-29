import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import UploadBox from '../components/UploadBox';
import FileProgressCard from '../components/FileProgressCard';
import DocumentTable from '../components/DocumentTable';
import NotificationBell from '../components/NotificationBell';
import { uploadSingleFile, uploadBulkFiles, fetchDocuments, fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api';
import { connectWebSocket } from '../websocket/websocket';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [uploadQueue, setUploadQueue] = useState({});
    const [isBulkUpload, setIsBulkUpload] = useState(false);

    const loadDocuments = async () => {
        try {
            const res = await fetchDocuments();
            setDocuments(res.data);
        } catch (error) {
            console.error("Failed to fetch documents", error);
        }
    };

    const loadNotifications = async () => {
        try {
            const res = await fetchNotifications();
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            await Promise.all([loadDocuments(), loadNotifications()]);
        };

        loadInitialData();

        const client = connectWebSocket((newNotification) => {
            setNotifications((prev) => [newNotification, ...prev]);
            toast.success(newNotification.message, { duration: 4000 });
            loadDocuments();
        });

        return () => {
            if (client) client.deactivate();
        };
    }, []);

    const handleFilesSelected = async (files) => {
        const isBulk = files.length > 3;
        setIsBulkUpload(isBulk);

        const newQueue = { ...uploadQueue };
        files.forEach((file, index) => {
            const fileId = `${file.name}-${Date.now()}-${index}`;
            file.id = fileId;
            newQueue[fileId] = { id: fileId, name: file.name, size: file.size, progress: 0, status: 'PENDING' };
        });
        setUploadQueue(newQueue);

        if (isBulk) {
            toast.loading(`Upload in progress — processing ${files.length} files in background`, { id: 'bulk-upload' });
            // Update statuses
            setUploadQueue(prev => {
                const updated = { ...prev };
                files.forEach(f => {
                    if(updated[f.id]) updated[f.id].status = 'UPLOADING';
                });
                return updated;
            });
            
            try {
                await uploadBulkFiles(files, (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadQueue(prev => {
                        const updated = { ...prev };
                        files.forEach(f => {
                            if(updated[f.id]) updated[f.id].progress = percentCompleted;
                        });
                        return updated;
                    });
                });
                
                setUploadQueue(prev => {
                    const updated = { ...prev };
                    files.forEach(f => {
                        if(updated[f.id]) {
                            updated[f.id].progress = 100;
                            updated[f.id].status = 'COMPLETE';
                        }
                    });
                    return updated;
                });
                // Note: The websocket will handle the success toast for bulk
                toast.dismiss('bulk-upload');
                loadDocuments();
            } catch {
                toast.dismiss('bulk-upload');
                toast.error("Bulk upload failed");
                setUploadQueue(prev => {
                    const updated = { ...prev };
                    files.forEach(f => {
                        if(updated[f.id]) updated[f.id].status = 'FAILED';
                    });
                    return updated;
                });
            }
        } else {
            // Upload files individually
            await Promise.all(files.map(file => uploadFile(file)));
            loadDocuments();
            toast.success("All files uploaded successfully");
        }
    };

    const uploadFile = async (file) => {
        setUploadQueue(prev => ({
            ...prev,
            [file.id]: { ...prev[file.id], status: 'UPLOADING' }
        }));

        try {
            await uploadSingleFile(file, (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadQueue(prev => ({
                    ...prev,
                    [file.id]: { ...prev[file.id], progress: percentCompleted }
                }));
            });

            setUploadQueue(prev => ({
                ...prev,
                [file.id]: { ...prev[file.id], progress: 100, status: 'COMPLETE' }
            }));
        } catch {
            setUploadQueue(prev => ({
                ...prev,
                [file.id]: { ...prev[file.id], status: 'FAILED' }
            }));
            toast.error(`Failed to upload ${file.name}`);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const queueFiles = Object.values(uploadQueue);

    return (
        <div className="min-h-screen bg-gray-50 font-livvic">
            <Toaster position="top-right" />
            
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                    D
                                </div>
                                <span className="text-xl font-bold text-gray-900 tracking-tight">DocHub</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <NotificationBell 
                                notifications={notifications} 
                                onMarkAsRead={handleMarkAsRead}
                                onMarkAllAsRead={handleMarkAllAsRead}
                            />
                            <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* Upload Section */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
                        <p className="text-gray-500 text-sm mt-1">Upload single or multiple PDF documents securely.</p>
                    </div>
                    <UploadBox onFilesSelected={handleFilesSelected} />
                </section>

                {/* Upload Progress Section */}
                {queueFiles.length > 0 && (
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            Upload Queue
                            <span className="bg-gray-200 text-gray-700 py-0.5 px-2.5 rounded-full text-xs">
                                {queueFiles.filter(f => f.status === 'UPLOADING').length} uploading
                            </span>
                        </h3>
                        <div className={`${isBulkUpload ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}`}>
                            {queueFiles.map(file => (
                                <FileProgressCard key={file.id} file={file} minimized={isBulkUpload} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Document Library Section */}
                <section>
                    <div className="mb-4 flex justify-between items-end">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Document Library</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage and download your uploaded documents.</p>
                        </div>
                        <span className="text-sm font-medium text-gray-500">{documents.length} documents</span>
                    </div>
                    <DocumentTable documents={documents} />
                </section>

            </main>
        </div>
    );
};

export default Dashboard;
