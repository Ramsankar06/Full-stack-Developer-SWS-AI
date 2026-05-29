import React from 'react';

const NotificationDropdown = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                    <button 
                        onClick={onMarkAllAsRead}
                        className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                    >
                        Mark all as read
                    </button>
                )}
            </div>
            <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">No notifications yet.</div>
                ) : (
                    notifications.map(notif => (
                        <div 
                            key={notif.id} 
                            className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-primary-50/50' : ''}`}
                            onClick={() => !notif.isRead && onMarkAsRead(notif.id)}
                        >
                            <div className="flex justify-between items-start">
                                <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                                    {notif.message}
                                </p>
                                {!notif.isRead && (
                                    <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0"></span>
                                )}
                            </div>
                            <span className="text-xs text-gray-400 mt-1 block">
                                {new Date(notif.createdAt).toLocaleString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationDropdown;
