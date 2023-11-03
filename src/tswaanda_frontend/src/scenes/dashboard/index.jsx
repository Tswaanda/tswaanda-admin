import React, { useState, useContext, useEffect } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import {
  DownloadOutlined,
  Email,
  PointOfSale,
  PersonAdd,
  Traffic,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import BreakdownChart from "../../components/BreakdownChart";
import OverviewChart from "../../components/OverviewChart";
import { useGetDashboardQuery } from "../../state/api";
import StatBox from "../../components/StatBox";
import { useNavigate } from "react-router-dom";
import { adminBlast, marketBlast, useAuth } from "../../hooks/auth";

const Dashboard = () => {
  const [adminStats, setAdminStats] = useState(null)
  const [marketStats, setMarketStats] = useState(null)
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState(null)


  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isNonMediumScreens = useMediaQuery("(min-width: 1200px");
  const { data, isLoading } = useGetDashboardQuery();

  useEffect(() => {
    getAdminStatistics()
    getMarketStatistics()
    getCustomers()
    getOrders()
  }, []);

  const getAdminStatistics = async () => {
    const stats = await adminBlast.getAdminStats()
    setAdminStats(stats)
  }

  const getMarketStatistics = async () => {
    const stats = await marketBlast.getMarketPlaceStats()
    setMarketStats(stats)
  }

  const getCustomers = async () => {
    const customers = await marketBlast.getAllKYC()
    setCustomers(customers)
  }

  const getOrders = async () => {
    const orders = await marketBlast.getAllOrders()
    setOrders(orders)
  }
  function groupCustomersByMonth(customers) {
    return customers?.reduce((acc, customer) => {
      const date = new Date(Number(customer.dateCreated));
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month]++;
      return acc;
    }, {});
  }

  function calculateGrowthRate(customersByMonth) {
    let previousMonthCount = 0;
    const growthRates = {};

    Object.keys(customersByMonth).sort().forEach(month => {
      const currentMonthCount = customersByMonth[month];
      if (previousMonthCount > 0) {
        const growthRate = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
        growthRates[month] = `${growthRate.toFixed(2)}%`;
      }
      previousMonthCount = currentMonthCount;
    });

    return growthRates;
  }

  const customersByMonth = groupCustomersByMonth(customers);
  const growthRates = calculateGrowthRate(customersByMonth);
  console.log("Growth rate", growthRates, "Customers by month", customersByMonth);

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "USER ID",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
    },
    {
      field: "products",
      headerName: "No. of Products",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => params.value.length,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => `$${Number(params.value).toFixed(2)}`,
    },
  ];

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated]);

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Tswaanda Dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: theme.palette.secondary.light,
              color: theme.palette.background.alt,
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlined sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="160px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        {/* ROW 1 */}
        <StatBox
          title="Total Customers"
          value={Number(marketStats?.totalCustomers)}
          increase="+14%"
          description="Since last month"
        />
        <StatBox
          title="Sales Today"
          value={data && data.todayStats.totalSales}
          increase="+21%"
          description="Since last month"
          icon={
            <PointOfSale
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={theme.palette.background.alt}
          p="1rem"
          borderRadius="0.55rem"
        >
          <OverviewChart view="sales" isDashboard={true} />
        </Box>
        <StatBox
          title="Monthly Sales"
          value={data && data.thisMonthStats.totalSales}
          increase="+5%"
          description="Since last month"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="Yearly Sales"
          value={data && data.yearlySalesTotal}
          increase="+43%"
          description="Since last month"
          icon={
            <Traffic
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        {/* ROW 2 */}

        <Box
          gridColumn="span 8"
          gridRow="span 3"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              borderRadius: "5rem",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: theme.palette.background.alt,
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: theme.palette.background.alt,
              color: theme.palette.secondary[100],
              borderTop: "none",
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${theme.palette.secondary[200]} !important`,
            },
          }}
        >
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={(data && data.transactions) || []}
            columns={columns}
          />
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 3"
          backgroundColor={theme.palette.background.alt}
          p="1.5rem"
          borderRadius="0.55rem"
        >
          <Typography variant="h6" sx={{ color: theme.palette.secondary[100] }}>
            Sales by Category
          </Typography>
          <BreakdownChart isDashboard={true} />
          <Typography
            p="0 0.6rem"
            fontSize="0.8rem"
            sx={{ color: theme.palette.secondary[200] }}
          >
            Breakdown of real states and information via category for revenue
            made for this year and total sales
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
