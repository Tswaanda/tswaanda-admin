import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import Header from '../../components/Header';
import FlexBetween from '../../components/FlexBetween';
import CampaignIcon from '@mui/icons-material/Campaign';

const NotificationCard = ({ title, content, dateTime }) => {
  const maxContentLength = 100; // Set a maximum length for the content before "Read More"

  const renderContent = () => {
    if (content.length <= maxContentLength) {
      return content;
    }

    const truncatedContent = content.substring(0, maxContentLength);
    return (
      <>
        {truncatedContent}
        {' '}
        <Button color="secondary" size="small">
          View More
        </Button>
      </>
    );
  };

  return (
    <Card sx={{ backgroundColor: 'transparent', marginBottom: 1 }}>
      <CardContent>
      <FlexBetween>
        
      </FlexBetween>
      <CampaignIcon color="secondary" />
        <FlexBetween>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }} gutterBottom>
            {title}
          </Typography>
          <Typography variant="caption" color="secondary">
              {new Date(dateTime).toLocaleString()}
          </Typography>
        </FlexBetween>
        <Typography variant="body1" color="lightgrey">
          {renderContent()}
        </Typography>
      </CardContent>
    </Card>
  );
};

const NotificationsPage = () => {
  const notifications = [
    { id: 1, title: 'New products listed', content: `More products have been listed and you can go ahead and look for the products you might have been looking out for`, dateTime: '2022-01-01T12:34:56' },
    { id: 2, title: 'New user added', content: 'New signup, please go and review the user .', dateTime: '2022-01-01T12:34:56' },
    // Add more notifications as needed
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 5 }}>
        <Header title="NOTIFICATIONS" subtitle="List of Notifications" />
      </Box>
      
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          title={notification.title}
          content={notification.content}
          dateTime={notification.dateTime}
        />
      ))}
    </Box>
  );
};

export default NotificationsPage;

