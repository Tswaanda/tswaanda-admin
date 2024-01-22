import { Button, Card, CardContent, Typography } from "@mui/material";
import FlexBetween from "../../../components/FlexBetween";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useAuth } from "../../../hooks/auth";
import { AdminNotification } from "../../../declarations/tswaanda_backend/tswaanda_backend.did";
import { FC, useState } from "react";
import { nanoDateFormat } from "../../../utils/time";

type Props = {
  notification: AdminNotification;
};

const NotificationCard: FC<Props> = ({ notification }) => {
  const [localNotification, setLocalNotification] = useState(notification);
  const { backendActor, setUpdateNotifications } = useAuth();
  const maxContentLength = 100;

  const renderContent = () => {
    if ("KYCUpdate" in localNotification.notification) {
      const truncatedContent =
        localNotification.notification.KYCUpdate.message.substring(
          0,
          maxContentLength
        );
      return (
        <CardContent>
          <FlexBetween></FlexBetween>
          {!localNotification.read && <CampaignIcon color="secondary" />}
          <FlexBetween>
            <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
              KYC Update
            </Typography>
            <Typography variant="caption" color="secondary">
              {nanoDateFormat(Number(localNotification.created))}
            </Typography>
          </FlexBetween>
          <Typography variant="body1" color="lightgrey">
            {localNotification.notification.KYCUpdate.message.length <=
            maxContentLength ? (
              localNotification.notification.KYCUpdate.message
            ) : (
              <>
                {truncatedContent}{" "}
                <Button color="secondary" size="small">
                  View More
                </Button>
              </>
            )}
          </Typography>
        </CardContent>
      );
    } else if ("OrderUpdate" in localNotification.notification) {
      const truncatedContent =
        localNotification.notification.OrderUpdate.message.substring(
          0,
          maxContentLength
        );
      return (
        <CardContent>
          <FlexBetween></FlexBetween>
          {!localNotification.read && <CampaignIcon color="secondary" />}
          <FlexBetween>
            <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
              Order Update
            </Typography>
            <Typography variant="caption" color="secondary">
              {nanoDateFormat(Number(localNotification.created))}
            </Typography>
          </FlexBetween>
          <Typography variant="body1" color="lightgrey">
            {localNotification.notification.OrderUpdate.message.length <=
            maxContentLength ? (
              localNotification.notification.OrderUpdate.message
            ) : (
              <>
                {truncatedContent}{" "}
                <Button color="secondary" size="small">
                  View More
                </Button>
              </>
            )}
          </Typography>
        </CardContent>
      );
    } else if ("ProductReview" in localNotification.notification) {
      const truncatedContent =
        localNotification.notification.ProductReview.review.substring(
          0,
          maxContentLength
        );
      return (
        <CardContent>
          <FlexBetween></FlexBetween>
          {!localNotification.read && <CampaignIcon color="secondary" />}
          <FlexBetween>
            <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
              Product Review
            </Typography>
            <Typography variant="caption" color="secondary">
              {nanoDateFormat(Number(localNotification.created))}
            </Typography>
          </FlexBetween>
          <Typography variant="body1" color="lightgrey">
            {localNotification.notification.ProductReview.review.length <=
            maxContentLength ? (
              localNotification.notification.ProductReview.review
            ) : (
              <>
                {truncatedContent}{" "}
                <Button color="secondary" size="small">
                  View More
                </Button>
              </>
            )}
          </Typography>
        </CardContent>
      );
    }
  };
  
  const markAsRead = async () => {
    setLocalNotification({ ...localNotification, read: true });
    try {
      await backendActor.markAdminNotificationAsRead(notification.id);
      setUpdateNotifications(true);
    } catch (error) {
      console.log("Error marking notification as read", error);
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
      {renderContent()}
    </Card>
  );
};

export default NotificationCard;
