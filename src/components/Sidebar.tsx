import React, { FC, useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  CalendarMonthOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
  PaidOutlined,
  NewspaperOutlined,
} from "@mui/icons-material";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Badge from "@mui/material/Badge";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import { marketActor } from "../config";
import StorageIcon from "@mui/icons-material/Storage";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

type Props = {
  drawerWidth: number;
  isSidebarOpen: boolean;
  setIsSidebarOpen: any;
  isNonMobile: boolean;
};

const Sidebar: FC<Props> = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const [newOrders, setNewOrders] = useState<any | null>(null);
  const [newKYC, setNewKYC] = useState<any | null>(null);

  const navItems = [
    {
      text: "Dashboard",
      icon: <HomeOutlined />,
    },
    {
      text: "Client Facing",
      icon: null,
    },
    {
      text: "Products",
      icon: <ShoppingCartOutlined />,
    },
    {
      text: "Customers",
      icon: (
        <Badge badgeContent={String(newKYC)} color="secondary">
          <Groups2Outlined />
        </Badge>
      ),
    },
    {
      text: "Farmers",
      icon: (
        <Badge
          // badgeContent={newKYC}
          color="secondary"
        >
          <AgricultureIcon />
        </Badge>
      ),
    },
    {
      text: "Transactions",
      icon: <ReceiptLongOutlined />,
    },
    {
      text: "Orders",
      icon: (
        <Badge badgeContent={String(newOrders)} color="secondary">
          <ShoppingCartCheckoutIcon />
        </Badge>
      ),
    },
    {
      text: "Wallet",
      icon: <PaidOutlined />,
    },
    {
      text: "Geography",
      icon: <PublicOutlined />,
    },
    {
      text: "Documents",
      icon: <ContentPasteIcon />,
    },
    {
      text: "Sales",
      icon: null,
    },
    {
      text: "Overview",
      icon: <PointOfSaleOutlined />,
    },
    {
      text: "Daily",
      icon: <TodayOutlined />,
    },
    {
      text: "Monthly",
      icon: <CalendarMonthOutlined />,
    },
    {
      text: "Breakdown",
      icon: <PieChartOutlined />,
    },
    {
      text: "Management",
      icon: null,
    },
    {
      text: "Admin-Staff",
      icon: <AdminPanelSettingsOutlined />,
    },
    {
      text: "Newsletters",
      icon: <NewspaperOutlined />,
    },
    {
      text: "Support",
      icon: <SupportAgentIcon />,
    },
    {
      text: "Performance",
      icon: <TrendingUpOutlined />,
    },
    {
      text: "Storage",
      icon: <StorageIcon />,
    },
  ];

  const getSize = async () => {
    const orderSize = await marketActor.getPendingOrdersSize();
    const kycSize = await marketActor.getPendingKYCReaquestSize();
    setNewOrders(orderSize);
    setNewKYC(kycSize);
  };

  useEffect(() => {
    getSize();
  }, []);

  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  if (pathname === "/login") return null;

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: (theme.palette.secondary as any as any)[200],
              backgroundColor: theme.palette.background.default,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={(theme.palette.secondary as any).main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Typography variant="h4" fontWeight="bold">
                    TSWAANDA
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem" }}>
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();

                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? (theme.palette.secondary as any)[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? (theme.palette.primary as any)[600]
                            : (theme.palette.secondary as any)[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? (theme.palette.primary as any)[600]
                              : (theme.palette.secondary as any)[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
