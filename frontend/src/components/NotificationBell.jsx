import React, { useState, useEffect, useRef } from 'react';

const NotificationBell = ({ notifications, onMarkAsRead, onMarkAllAsRead }) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors focus:outline-none"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
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
            )}
        </div>
    );
};

export default NotificationBell;
