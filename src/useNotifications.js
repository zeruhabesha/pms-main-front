import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1/notifications";

const useNotifications = (userId) => {
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        const unreadNotifications = response.data.filter(
          (notif) => !notif.isRead
        );

        const counts = {
          dashboard: unreadNotifications.length, // Example: count for Dashboard
          maintenance: unreadNotifications.filter((n) => n.type === "maintenance").length,
          complaint: unreadNotifications.filter((n) => n.type === "complaint").length,
          guest: unreadNotifications.filter((n) => n.type === "guest").length,
          clearance: unreadNotifications.filter((n) => n.type === "clearance").length,
        };

        setUnreadCounts(counts);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Real-time updates with WebSockets
    const socket = io("http://localhost:4000/api/v1");
    socket.on(`notification_${userId}`, (newNotification) => {
      setUnreadCounts((prev) => ({
        ...prev,
        [newNotification.type]: (prev[newNotification.type] || 0) + 1,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return unreadCounts;
};

export default useNotifications;
