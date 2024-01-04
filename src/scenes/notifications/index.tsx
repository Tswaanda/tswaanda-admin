import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth";
import { Button } from "@mui/material";
import { get } from "http";
import { AdminNotification } from "../../declarations/tswaanda_backend/tswaanda_backend.did";

const NotificationsPage = () => {
  const { wsMessage, backendActor } = useAuth();
  const [notifications, setNotifications] = useState<AdminNotification[]| null>(null);

  useEffect(() => {
    if (backendActor) {
      getNotifications()
    }
  }, [backendActor]);

  useEffect(() => {
    if (wsMessage) {
      console.log("WS Message: ", wsMessage);
    }
  }, [wsMessage]);

  const getNotifications = async () => {
    try {
      const res = await backendActor.getAdminNotifications();
      setNotifications(res);
      console.log("Notifications: ", res);
    } catch (error) {
      console.log("Error on getting notifications", error);
    }
  }

  return (
    <div>
      {" "}
      <Button
      //  onClick={() => sendOrderUpdateWSMessage("Approved")}
      >
        Send Order Update
      </Button>
      <Button
      //  onClick={() => sendKYCUpdateWSMessage("Approved")}
      >
        Send KYC Update
      </Button>
    </div>
  );
};

export default NotificationsPage;
