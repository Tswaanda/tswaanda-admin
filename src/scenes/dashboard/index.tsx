import React, { useState, useContext, useEffect } from "react";
import FlexBetween from "../../components/FlexBetween";
import Header from "../../components/Header";
import {
  DownloadOutlined,
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
  CardMedia,
  CardContent,
  Card,
  CardActionArea
} from "@mui/material";

import BreakdownChart from "../../components/BreakdownChart";
import StatBox from "../../components/StatBox";
import { useNavigate } from "react-router-dom";
import NewOrders from "../../components/Dashboard/NewOrders";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth";

const Dashboard = () => {
  const [products, setProducts] = useState([]);

  const [adminStats, setAdminStats] = useState(null)
  const [marketStats, setMarketStats] = useState(null)
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [modifiedOrders, setModifiedOrders] = useState([])
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
  const { isAuthenticated, backendActor, marketActor } = useAuth();
  const navigate = useNavigate();

  const isNonMediumScreens = useMediaQuery("(min-width: 1200px");

  useEffect(() => {
    getMarketStatistics()
    getAdminStatistics()
    getCustomers()
    getProducts()
    getOrders()
    getSize();
  }, []);

  const getAdminStatistics = async () => {
    const stats = await backendActor.getAdminStats()
    setAdminStats(stats)
  }

  const getMarketStatistics = async () => {
    const stats = await marketActor.getMarketPlaceStats()
    setMarketStats(stats)
  }

  const getCustomers = async () => {
    const customers = await marketActor.getAllKYC()

    const newCustomers = customers.filter(customer => customer.status === "pending")
    setNewKYC(newCustomers)
    setCustomers(customers)
  }

  const getOrders = async () => {
    const orders = await marketActor.getAllOrders()
    const newOrders = orders.filter(order => order.status === "pending")
    const convertedOrders = convertData(newOrders);
    convertedOrders.splice(7, convertedOrders.length - 1)
    setModifiedOrders(convertedOrders)
    setNewOrders(newOrders)
    setOrders(orders)
  }

  const getSize = async () => {
    const orderSize = await marketActor.getPendingOrdersSize();
    const kycSize = await marketActor.getPendingKYCReaquestSize();
    setNewOrdersNum(Number(orderSize));
    setNewKYCNum(Number(kycSize));
  };

  const getProducts = async () => {
    const products = await backendActor.getAllProducts()
    products.splice(3, products.length - 1)
    setProducts(products)
  }

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
    const sortedOrders = orders.slice().sort((a, b) => Number(a.dateCreated) - Number(b.dateCreated));
    return sortedOrders.reduce((acc, order) => {
      const date = new Date(Number(order.dateCreated));
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month]++;
      return acc;
    }, {});
  };


  const calculateOrdersGrowthRate = (ordersByMonth) => {
    let previousMonthCount = -1;
    const ordersGrowthRates = {};

    const sortedMonths = Object.keys(ordersByMonth).sort();

    sortedMonths.forEach(month => {
      const currentMonthCount = ordersByMonth[month];
      if (previousMonthCount === -1) {
        ordersGrowthRates[month] = 'N/A';
      } else if (previousMonthCount > 0) {
        const growthRate = ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
        ordersGrowthRates[month] = `${growthRate.toFixed(2)}%`;
      }
      previousMonthCount = currentMonthCount;
    });

    return ordersGrowthRates;
  };


  useEffect(() => {
    if (customers && orders) {
      const customersByMonth = groupCustomersByMonth(customers);
      const customersGrowthRates = calculateGrowthRate(customersByMonth);
      const ordersByMonth = groupOrdersByMonth(orders);

      const currentMonth = Object.keys(ordersByMonth).sort().pop();
      const orderGrowthRates = calculateOrdersGrowthRate(ordersByMonth);
      setCurrentMonthOrderRate(orderGrowthRates[currentMonth]);

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
      const newOrderGrowthRates = calculateOrdersGrowthRate(newOrdersByMonth);
      setNewOrderCurrentMonthOrderRate(newOrderGrowthRates[currentMonth]);

      const currentMonthC = Object.keys(newCustomersByMonth).sort().pop();
      setCurrentMonthNewRate(newCustomersGrowthRates[currentMonthC]);

      setNewOrdersByMonth(newOrdersByMonth);
      setNewOrdersGrowthRates(newOrderGrowthRates);
      setNewCustomersByMonth(newCustomersByMonth);
      setNewCustomersGrowthRates(newCustomersGrowthRates);
    }
  }, [newOrders, newKYC])

  const convertData = (data) => {
    if (!data) {
      return [];
    }

    const formatOrderDate = (timestamp) => {
      const date = new Date(Number(timestamp));
      const options = {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    };

    const formatOrderTime = (timestamp) => {
      const date = new Date(Number(timestamp));
      const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      return date.toLocaleTimeString("en-US", options);
    };

    const modifiedOrder = data.map((order) => {


      const formattedDate = formatOrderDate(order.dateCreated);
      const formattedTime = formatOrderTime(order.dateCreated);

      return {
        ...order,
        step: Number(order.step),
        dateCreated: `${formattedDate} at ${formattedTime}`,
      };
    });

    return modifiedOrder;
  }

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

  const getRandom = () => {
    const min = 5;
    const max = 10;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

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
          p="0.5rem"
          borderRadius="0.55rem"
        >
          <h2>Popular products products</h2>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              "& > div": {
                width: "30%",
              },
            }}
          >
            {products?.map((product, index) =>
              <Card
                key={index}
                sx={{ maxWidth: 345, backgroundColor: theme.palette.background.alt }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.images[0]}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      <span style={{ fontWeight: "bold" }} >{product.name}</span> - {getRandom()} sold
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.fullDescription.length > 100 ? product.fullDescription.slice(0, 100) + "..." : product.fullDescription} <a style={{ color: "white" }} href={`https://tswaanda.com/product/${product.id}`}>Visit product page</a>
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>)}
          </Box>
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
          backgroundColor={theme.palette.background.alt}
          gridRow="span 3"
          p="1rem"
          borderRadius="0.55rem"

        >
          <h2>New Orders</h2>
          <NewOrders orders={modifiedOrders} />
          <Button
            variant="contained"
            component={Link}
            to={`/orders`}
            color="primary"
            sx={{
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              width: "20%",
              marginTop: "10px"
            }}
          >
            View more
          </Button>
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
