import React, { useState, useContext } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { useDispatch } from "react-redux";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { setMode } from "../state/globalSlice";
import {
  AppBar,
  InputBase,
  IconButton,
  Toolbar,
  useTheme,
  MenuItem,
  Button,
  Typography,
  Box,
  Menu,
  Popover,
  Badge,
  List, 
  ListItem, 
  ListItemText, 
  Divider
} from "@mui/material";
import { useAuth } from "../hooks/auth";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const { logout, isAuthenticated } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event: any) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotificationsPage = () => {
    navigate("/notifications");
  };

  const notifications = [
    {
      id: 1,
      title: 'New Product Approval',
      description: 'A new product has been submitted and is awaiting your approval.',
      date: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Order Shipped',
      description: 'Order #123456 has been shipped and is on its way to the customer.',
      date: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Low Stock Alert',
      description: 'The stock for product XYZ is running low. Consider restocking soon.',
      date: new Date().toISOString(),
    },
    {
      id: 4,
      title: 'Low Bitches Alert',
      description: 'The stock for product XYZ is running low. Consider restocking soon. The stock for product XYZ is running low. Consider restocking soon. The stock for product XYZ is running low. Consider restocking soon.',
      date: new Date().toISOString(),
    },
    {
      id: 5,
      title: 'Low Bitches Alert',
      description: 'The stock for product XYZ is running low. Consider restocking soon. The stock for product XYZ is running low. Consider restocking soon. The stock for product XYZ is running low. Consider restocking soon.',
      date: new Date().toISOString(),
    },
];

  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const isNotificationsOpen = Boolean(notificationsAnchorEl);
  const handleNotificationsClick = (event: any) => setNotificationsAnchorEl(event.currentTarget);
  const handleNotificationsClose = () => setNotificationsAnchorEl(null);

  const recentNotifications = notifications.slice(0, 4);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + '...';
  };

  if (!isAuthenticated) return null;

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <FlexBetween
            sx={{ backgroundColor: theme.palette.background.default }}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* RIGHT SIDE */}

        <FlexBetween gap="1.5rem">
          <IconButton 
            onClick={handleNotificationsClick}
          >
            <Badge color="secondary" variant="dot" overlap="circular">
              <NotificationsIcon sx={{ fontSize: "25px" }} />
            </Badge>
          </IconButton>

          <Popover
            open={isNotificationsOpen}
            anchorEl={notificationsAnchorEl}
            onClose={handleNotificationsClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            slotProps={{
              paper : { sx: { width: "20%", backgroundColor: theme.palette.background.default },
                },
            }}
          >
            <List>
              <ListItem >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center', 
                  }} 
                >
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: 'pointer', marginLeft: 'auto', color: theme.palette.secondary.light }}
                    onClick={handleNotificationsPage}
                  >
                    View All
                  </Typography>
                  <ArrowForwardIcon fontSize="small" />
                </Box>
              </ListItem>
              <Divider />
              {recentNotifications.map((notification, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    onClick={handleNotificationsPage}
                    sx={{ cursor: "pointer", "&:hover": { color: theme.palette.secondary.light } }}
                  >
                    <ListItemText
                      primary={<Typography variant="body1" fontWeight="bold">{notification.title}</Typography>}
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">
                            {truncateText(notification.description, 50)} {/*Truncate to 20 letters */}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index !== recentNotifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Popover>

          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton>
            <SettingsOutlined sx={{ fontSize: "25px" }} />
          </IconButton>

          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Box
                component="img"
                alt="profile"
                src="../assets/confidence.png"
                height="32px"
                width="32px"
                borderRadius="50%"
                sx={{ objectFit: "cover" }}
              />
              <Box textAlign="left">
                <Typography
                  fontWeight="bold"
                  fontSize="0.85rem"
                  sx={{ color: (theme.palette.secondary as any)[100] }}
                >
                  {user.name}
                </Typography>
                <Typography
                  fontWeight="bold"
                  fontSize="0.75rem"
                  sx={{ color: (theme.palette.secondary as any)[200] }}
                >
                  {user.occupation}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{
                  color: (theme.palette.secondary as any)[300],
                  fontSize: "25px",
                }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
              >
                Log Out
              </MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
