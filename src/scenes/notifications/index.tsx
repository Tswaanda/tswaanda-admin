import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { AdminNotification } from "../../declarations/tswaanda_backend/tswaanda_backend.did";
import { useAuth } from "../../hooks/auth";
import NotificationCard from "./components/NotificationCard";
import { Box } from "@mui/material";

const NotificationsPage = () => {
  const { backendActor } = useAuth();
  const [notifications, setNotifications] = useState<
    AdminNotification[] | null
  >(null);

  useEffect(() => {
    if (backendActor) {
      fetchNotifications();
    }
  }, [backendActor]);

  const fetchNotifications = async () => {
    const notifications = await backendActor?.getAdminNotifications();
    if (notifications) {
      notifications.sort((a: AdminNotification, b: AdminNotification) => {
        return Number(b.created) - Number(a.created);
      });
      setNotifications(notifications);
    }
  };

  console.log("notifications", notifications)

  return (
    <Box m="1.5rem 2.5rem">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ marginBottom: 5 }}
      >
        <Header title="NOTIFICATIONS" subtitle="List of Notifications" />
      </Box>

      {notifications?.map((notification) => (
        <NotificationCard key={notification.id} {...{ notification }} />
      ))}
    </Box>
  );
};

export default NotificationsPage;
