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
  const [orders, setOrders] = useState([])
  const [customersGrowthRates, setCustomersGrowthRates] = useState(null)
  const [customersByMonth, setCustomersByMonth] = useState(null)
  const [currentMonthRate, setCurrentMonthRate] = useState(null)

  const [newOrdersNum, setNewOrdersNum] = useState(null);
  const [newKYCNum, setNewKYCNum] = useState(null);

  const [newOrders, setNewOrders] = useState(null);
  const [newKYC, setNewKYC] = useState(null);
  const [newCustomersGrowthRates, setNewCustomersGrowthRates] = useState(null)
  const [newCustomersByMonth, setNewCustomersByMonth] = useState(null)
  const [NCCurrentMonthNewRate, setCurrentMonthNewRate] = useState(null)

  const [newoOrdersGrowthRates, setNewOrdersGrowthRates] = useState(null)
  const [newOrdersByMonth, setNewOrdersByMonth] = useState(null)
  const [newOrderscurrentMonthOrderRate, setNewOrderCurrentMonthOrderRate] = useState(null)



  const [ordersGrowthRates, setOrdersGrowthRates] = useState(null)
  const [ordersByMonth, setOrdersByMonth] = useState(null)
  const [currentMonthOrderRate, setCurrentMonthOrderRate] = useState(null)


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
    getSize();
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

    const newCustomers = customers.filter(customer => customer.status === "pending")
    setNewKYC(newCustomers)
    setCustomers(customers)
  }

  const getOrders = async () => {
    const orders = await marketBlast.getAllOrders()
    const newOrders = orders.filter(order => order.status === "pending")
    setNewOrders(newOrders)
    setOrders(orders)
  }

  const getSize = async () => {
    const orderSize = await marketBlast.getPendingOrdersSize();
    const kycSize = await marketBlast.getPendingKYCReaquestSize();
    setNewOrdersNum(Number(orderSize));
    setNewKYCNum(Number(kycSize));
  };

  // Customers growth rate
  const groupCustomersByMonth = (customers) => {
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

  const calculateGrowthRate = (customersByMonth) => {
    let previousMonthCount = 0;
    const customersGrowthRates = {};

    Object.keys(customersByMonth).sort().forEach(month => {
      const currentMonthCount = customersByMonth[month];
      if (previousMonthCount > 0) {
        const growthRate = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
        customersGrowthRates[month] = `${growthRate.toFixed(2)}%`;
      }
      previousMonthCount = currentMonthCount;
    });

    return customersGrowthRates;
  }

  // Orders growth rate
  const groupOrdersByMonth = (orders) => {
    return orders?.reduce((acc, order) => {
      const date = new Date(Number(order.dateCreated));
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month]++;
      return acc;
    }, {});
  }

  const calculateOrdersGrowthRate = (ordersByMonth) => {
    let previousMonthCount = 0;
    const customersGrowthRates = {};

    Object.keys(ordersByMonth).sort().forEach(month => {
      const currentMonthCount = ordersByMonth[month];
      if (previousMonthCount > 0) {
        const growthRate = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
        customersGrowthRates[month] = `${growthRate.toFixed(2)}%`;
      }
      previousMonthCount = currentMonthCount;
    });

    return customersGrowthRates;
  }

  useEffect(() => {
    if (customers && orders) {
      const customersByMonth = groupCustomersByMonth(customers);
      const customersGrowthRates = calculateGrowthRate(customersByMonth);
      const ordersByMonth = groupOrdersByMonth(orders);

      const currentMonth = Object.keys(ordersByMonth).sort().pop();
      setCurrentMonthOrderRate(customersGrowthRates[currentMonth]);
      const orderGrowthRates = calculateOrdersGrowthRate(ordersByMonth);

      const currentMonthC = Object.keys(customersByMonth).sort().pop();
      setCurrentMonthRate(customersGrowthRates[currentMonthC]);

      setOrdersByMonth(ordersByMonth);
      setOrdersGrowthRates(orderGrowthRates);
      setCustomersByMonth(customersByMonth);
      setCustomersGrowthRates(customersGrowthRates);

    }
  }, [customers, orders])

 useEffect(() => {
    if (newOrders && newKYC) {
      const newCustomersByMonth = groupCustomersByMonth(newKYC);
      const newCustomersGrowthRates = calculateGrowthRate(newCustomersByMonth);
      const newOrdersByMonth = groupOrdersByMonth(newOrders);

      const currentMonth = Object.keys(newOrdersByMonth).sort().pop();
      setNewOrderCurrentMonthOrderRate(newCustomersGrowthRates[currentMonth]);
      const newOrderGrowthRates = calculateOrdersGrowthRate(newOrdersByMonth);

      const currentMonthC = Object.keys(newCustomersByMonth).sort().pop();
      setCurrentMonthNewRate(newCustomersGrowthRates[currentMonthC]);

      setNewOrdersByMonth(newOrdersByMonth);
      setNewOrdersGrowthRates(newOrderGrowthRates);
      setNewCustomersByMonth(newCustomersByMonth);
      setNewCustomersGrowthRates(newCustomersGrowthRates);
    }
 } , [newOrders, newKYC])

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
          increase={currentMonthRate}
          description="Since last month"
        />
        <StatBox
          title="Total Orders"
          value={Number(marketStats?.totalOrders)}
          increase={currentMonthOrderRate}
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
          title="New KYC request"
          value={Number(newKYCNum)}
          increase={NCCurrentMonthNewRate}
          description="Since last month"
          icon={
            <PersonAdd
              sx={{ color: theme.palette.secondary[300], fontSize: "26px" }}
            />
          }
        />
        <StatBox
          title="New Orders"
          value={Number(newOrdersNum)}
          increase={newOrderscurrentMonthOrderRate}
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
