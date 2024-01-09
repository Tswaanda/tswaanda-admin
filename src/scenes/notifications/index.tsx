import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { AdminNotification } from "../../declarations/tswaanda_backend/tswaanda_backend.did";
import { useAuth } from "../../hooks/auth";
import NotificationCard from "./components/NotificationCard";
import { Box } from "@mui/material";

const _notifications = [
  {
    id: 1,
    title: "New products listed",
    content: `More products have been listed and you can go ahead and look for the products you might have been looking out for`,
    dateTime: "2022-01-01T12:34:56",
    read: true,
  },
  {
    id: 2,
    title: "New user added",
    content: "New signup, please go and review the user .",
    dateTime: "2022-01-01T12:34:56",
    read: false,
  },
  {
    id: 3,
    title: "New user added",
    content: "New signup, please go and review the user .",
    dateTime: "2022-01-01T12:34:56",
    read: false,
  },
  {
    id: 4,
    title: "New user added",
    content: "New signup, please go and review the user .",
    dateTime: "2022-01-01T12:34:56",
    read: false,
  },
  {
    id: 5,
    title: "New user added",
    content: "New signup, please go and review the user .",
    dateTime: "2022-01-01T12:34:56",
    read: false,
  },
  {
    id: 6,
    title: "New user added",
    content: "New signup, please go and review the user .",
    dateTime: "2022-01-01T12:34:56",
    read: true,
  },
  {
    id: 7,
    title: "New user added",
    content: "New signup, please go and review the user .",
    dateTime: "2022-01-01T12:34:56",
    read: true,
  },
  {
    id: 8,
    title: "New user added",
    content: "New signup, please go and review the user .",
    dateTime: "2022-01-01T12:34:56",
    read: false,
  },
  {
    id: 9,
    title: "New user added",
    content: "New signup, please go and review the user .",
    dateTime: "2022-01-01T12:34:56",
    read: false,
  }
  // Add more notifications as needed
];

const NotificationsPage = () => {
  const {  backendActor } = useAuth();
  const [notifications, setNotifications] = useState<
    AdminNotification[] | null
  >(null);

  useEffect(() => {
    if (backendActor) {
      fetchNotifications();
    }
  }, [backendActor]);

  const fetchNotifications = async () => {
    const notifications = await backendActor.getAdminNotifications();
    notifications.sort((a: AdminNotification, b: AdminNotification) => {
      return Number(b.created) - Number(a.created);
    });
    setNotifications(notifications);
  };

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
        <NotificationCard
          key={notification.id}
          {...{notification}}
        />
      ))}
    </Box>
  );
};

export default NotificationsPage;
