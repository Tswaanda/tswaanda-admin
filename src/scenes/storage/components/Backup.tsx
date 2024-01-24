import React, { useState, useContext, useEffect } from "react";
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  Box,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import { useAuth } from "../../../hooks/auth";
import RestoreProducts from "../../../scenes/products/RestoreProducts";
import RestoreUsersModal from "../../../scenes/products/RestoreUsersModal";
import { Stats as adStats } from "../../../declarations/tswaanda_backend/tswaanda_backend.did";
import { Stats as mStats} from "../../../declarations/marketplace_backend/marketplace_backend.did";

const Backup = () => {
  const { backendActor, marketActor } = useAuth();
  const [adminStats, setAdminStats] = useState<adStats | null>(null)
  const [marketStats, setMarketStats] = useState<mStats | null>(null)

  const theme = useTheme();

  const [openRestoreProductsModal, setRestoreProductsModal] = useState(false);
  const [openRestoreUsersModal, setRestoreUsersModal] = useState(false);

  useEffect(() => {
   if (backendActor && marketActor) {
    getMarketStatistics()
    getAdminStatistics()
   }
  }, [backendActor, marketActor]);

  const getAdminStatistics = async () => {
    const stats = await backendActor?.getAdminStats()
    if (stats) {
      setAdminStats(stats)
    }
  }

  const getMarketStatistics = async () => {
    const stats = await marketActor?.getMarketPlaceStats()
    if (stats) {
      setMarketStats(stats)
    }
  }

  const handleBackupProducts = async () => {
    const products = await backendActor?.getAllProducts();

    const productsWithBigIntAsString = products?.map((product: any) => ({
      ...product,
      created: product.created.toString(),
    }));

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(productsWithBigIntAsString));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "products.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  const handleMarketplaceUsersBackup = async () => {
    const users = await marketActor?.getAllKYC();

    const usersWithBigIntAsString = users?.map((user : any) => ({
      ...user,
      userId: user.userId.toString(),
      zipCode: user.zipCode.toString(),
      phoneNumber: user.phoneNumber.toString(),
      dateCreated: user.dateCreated.toString(),
    }));

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(usersWithBigIntAsString));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "marketplace_users.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  console.log(adminStats, marketStats)

  return (
    <div className="">
      <Typography style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
        Data backup management
      </Typography>
      <Box
        gridColumn="span 8"
        gridRow="span 2"
        component="div"
        sx={{backgroundColor: theme.palette.background.default}}
        p="0.5rem"
        borderRadius=""
      >
        {/* Products backup section */}
        <Box>
          <Typography style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>Products</Typography>
          <Box display="flex" justifyContent="start" alignItems="center">
            <Button
              variant="contained"
              onClick={handleBackupProducts}
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.background.default,
                fontSize: "14px",
                fontWeight: "bold",
                marginRight: "10px",
                padding: "10px 20px",
              }}
            >
              <DownloadIcon sx={{ mr: "10px" }} />
              Backup products to JSON
            </Button>
            <Button
              variant="contained"
              onClick={() => setRestoreProductsModal(true)}
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.background.default,
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              < FileUploadIcon sx={{ mr: "10px" }} />
              Restore products from JSON
            </Button>
            <Typography style={{ fontSize: "18px", fontWeight: "bold", marginLeft: "50px" }}>
              Total products: {Number(adminStats?.totalProducts)}
            </Typography>
          </Box>
        </Box>
        <hr />
        {/* Products backup section end */}

        {/* Market place users backup */}

        <Box>
          <Typography style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>Users</Typography>
          <Box display="flex" justifyContent="start" alignItems="center">
            <Button
              variant="contained"
              onClick={handleMarketplaceUsersBackup}
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.background.default,
                fontSize: "14px",
                fontWeight: "bold",
                marginRight: "10px",
                padding: "10px 20px",
              }}
            >
              <DownloadIcon sx={{ mr: "10px" }} />
              Backup users to JSON
            </Button>
            <Button
              variant="contained"
              onClick={() => setRestoreUsersModal(true)}
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.background.default,
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              < FileUploadIcon sx={{ mr: "10px" }} />
              Restore users from JSON
            </Button>
            <Typography style={{ fontSize: "18px", fontWeight: "bold", marginLeft: "50px" }}>
              Total Users: {Number(marketStats?.totalCustomers)}
            </Typography>
          </Box>
        </Box>
        <hr />

        {/* Orders */}

        <Box>
          <Typography style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>Orders</Typography>
          <Box display="flex" justifyContent="start" alignItems="center">
            <Button
              variant="contained"
              // onClick={handleMarketplaceUsersBackup}
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.background.default,
                fontSize: "14px",
                fontWeight: "bold",
                marginRight: "10px",
                padding: "10px 20px",
              }}
            >
              <DownloadIcon sx={{ mr: "10px" }} />
              Backup Orders to JSON
            </Button>
            <Button
              variant="contained"
              onClick={() => setRestoreUsersModal(true)}
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.background.default,
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              < FileUploadIcon sx={{ mr: "10px" }} />
              Restore orders from JSON
            </Button>
            <Typography style={{ fontSize: "18px", fontWeight: "bold", marginLeft: "50px" }}>
              Total Orders: {Number(marketStats?.totalOrders)}
            </Typography>
          </Box>
        </Box>
        <hr />

      </Box>
      <>
        {openRestoreProductsModal && <RestoreProducts {...{ openRestoreProductsModal, setRestoreProductsModal, getAdminStatistics }} />}
        {openRestoreUsersModal && <RestoreUsersModal {...{ openRestoreUsersModal, setRestoreUsersModal, getMarketStatistics }} />}
      </>
    </div>
  )
}

export default Backup