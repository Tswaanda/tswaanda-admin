import { Button, Card, CardContent, Typography } from "@mui/material";
import FlexBetween from "../../../components/FlexBetween";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useAuth } from "../../../hooks/auth";
import { AdminNotification } from "../../../declarations/tswaanda_backend/tswaanda_backend.did";
import { FC, useState } from "react";
import { nanoDateFormat } from "../../../utils/time";

type Props = {
  notification: AdminNotification
}

const NotificationCard: FC<Props> = ({ notification }) => {
  const [localNotification, setLocalNotification] = useState(notification);
  const { backendActor } = useAuth();
  const maxContentLength = 100;

  const renderContent = () => {
    if ("KYCUpdate" in localNotification.notification) {
      if (localNotification.notification.KYCUpdate.message.length <= maxContentLength) {
        return localNotification.notification.KYCUpdate.message;
      }

      const truncatedContent = localNotification.notification.KYCUpdate.message.substring(
        0,
        maxContentLength
      );
      return (
        <>
          {truncatedContent}{" "}
          <Button color="secondary" size="small">
            View More
          </Button>
        </>
      );
    } else if ("OrderUpdate" in localNotification.notification) {
      if (localNotification.notification.OrderUpdate.message.length <= maxContentLength) {
        return localNotification.notification.OrderUpdate.message;
      }

      const truncatedContent = localNotification.notification.OrderUpdate.message.substring(
        0,
        maxContentLength
      );
      return (
        <>
          {truncatedContent}{" "}
          <Button color="secondary" size="small">
            View More
          </Button>
        </>
      );
    }
  
  };
  const markAsRead = async () => {
    setLocalNotification({ ...localNotification, read: true });
    try {
      const res = await backendActor.markAdminNotificationAsRead(notification.id);
    console.log(res);
    } catch (error) {
      console.log("Error marking notification as read", error)
    }
  };

  return (
    <Card
    onClick={markAsRead}
      sx={{
        backgroundColor: localNotification.read ? "transparent" : "#008080",
        marginBottom: 1,
        cursor: "pointer",
      }}
    >
      <CardContent>
        <FlexBetween></FlexBetween>
        {/* Make the color dynamic, depending on notification.read if it's true or false */}
        {!localNotification.read && <CampaignIcon color="secondary" />}
        <FlexBetween>
          <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
            {("KYCUpdate" in localNotification.notification && "KYC Update") ||
              ("OrderUpdate" in localNotification.notification && "Order Update")}
          </Typography>
          <Typography variant="caption" color="secondary">
            {nanoDateFormat(Number(localNotification.created))}
          </Typography>
        </FlexBetween>
        <Typography variant="body1" color="lightgrey">
          {renderContent()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
