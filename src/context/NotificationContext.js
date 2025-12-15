import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';

const NotificationContext = createContext();

export function useNotification() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
    const [unreadCount, setUnreadCount] = useState(0);
    const [user, setUser] = useState(null);

    // Keep user in sync with localStorage or AuthContext (better usage of AuthContext but this is simpler for plug-in)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        // Poll for updates? Or just fetch on mount.
        // For simplicity, we'll fetch on mount and provide refresh function.
    }, []);

    const fetchUnreadCount = async () => {
        const storedUser = localStorage.getItem('user');
        const currentUser = storedUser ? JSON.parse(storedUser) : null;

        if (!currentUser) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/notifications/${currentUser._id}`);
            if (response.ok) {
                const data = await response.json();
                const count = data.filter(n => !n.is_read).length;
                setUnreadCount(count);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        // Set an interval to poll every 60 seconds for new notifications?
        const interval = setInterval(fetchUnreadCount, 60000);
        return () => clearInterval(interval);
    }, [user?._id]); // Re-run if user changes

    const markAllAsRead = async () => {
        if (!user) return;
        try {
            // Optimistic update
            setUnreadCount(0);
            await fetch(`${API_BASE_URL}/api/notifications/${user._id}/read-all`, { method: 'PUT' });
            // re-fetch to be sure? no need if optimistic worked.
        } catch (err) {
            console.error("Error marking all read:", err);
            fetchUnreadCount(); // Revert on error
        }
    };

    // Helper to manually refresh (e.g., after reading one)
    const refreshNotifications = () => {
        fetchUnreadCount();
    };

    // Helper to decrement locally (e.g. reading a single one)
    const decrementUnread = () => {
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const value = {
        unreadCount,
        markAllAsRead,
        refreshNotifications,
        decrementUnread
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}
