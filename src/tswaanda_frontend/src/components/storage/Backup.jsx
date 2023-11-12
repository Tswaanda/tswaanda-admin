import React, { useState, useContext, useEffect } from "react";
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  Box,
  Button,
  Typography,
  useTheme,
} from "@mui/material";
import { adminBlast, marketBlast, useAuth } from "../../hooks/auth";
import RestoreProducts from "../../scenes/products/RestoreProducts";
import RestoreUsersModal from "../../scenes/products/RestoreUsersModal";

const Backup = () => {
  const { backendActor } = useAuth();
  const [adminStats, setAdminStats] = useState(null)
  const [marketStats, setMarketStats] = useState(null)

  const theme = useTheme();

  const [openRestoreProductsModal, setRestoreProductsModal] = useState(false);
  const [openRestoreUsersModal, setRestoreUsersModal] = useState(false);

  useEffect(() => {
    getMarketStatistics()
    getAdminStatistics()
  }, []);

  const getAdminStatistics = async () => {
    const stats = await adminBlast.getAdminStats()
    setAdminStats(stats)
  }

  const getMarketStatistics = async () => {
    const stats = await marketBlast.getMarketPlaceStats()
    setMarketStats(stats)
  }

  const handleBackupProducts = async () => {
    const products = await backendActor.getAllProducts();

    const productsWithBigIntAsString = products.map(product => ({
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
    // const users = await backendActor.getAllUsers();
  }

  console.log("adminStats", adminStats)
  console.log("marketStats", marketStats)

  return (
    <div className="">
      <Typography style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
        Data backup management
      </Typography>
      <Box
        gridColumn="span 8"
        gridRow="span 2"
        backgroundColor={theme.palette.background.alt}
        p="0.5rem"
        borderRadius=""
      >
        {/* Products backup section */}
        <Box>
          <Typography style={{fontSize: "20", fontWeight: "bold", marginBottom: "10px" }}>Products</Typography>
          <Box display="flex" justifyContent="start" alignItems="center">
            <Button
              variant="contained"
              onClick={handleBackupProducts}
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.background.alt,
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
                color: theme.palette.background.alt,
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              < FileUploadIcon sx={{ mr: "10px" }} />
              Restore products from JSON
            </Button>
            <Typography style={{ fontSize: "18px", fontWeight: "bold", marginLeft: "50px" }}>
              Total products: {adminStats?.totalProducts}
            </Typography>
          </Box>
        </Box>
        <hr />
        {/* Products backup section end */}

        {/* Market place users backup */}

        <Box>
          <Typography style={{fontSize: "20", fontWeight: "bold", marginBottom: "10px" }}>Products</Typography>
          <Box display="flex" justifyContent="start" alignItems="center">
            <Button
              variant="contained"
              onClick={handleMarketplaceUsersBackup}
              sx={{
                backgroundColor: theme.palette.secondary.light,
                color: theme.palette.background.alt,
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
                color: theme.palette.background.alt,
                fontSize: "14px",
                fontWeight: "bold",
                padding: "10px 20px",
              }}
            >
              < FileUploadIcon sx={{ mr: "10px" }} />
              Restore users from JSON
            </Button>
            <Typography style={{ fontSize: "18px", fontWeight: "bold", marginLeft: "50px" }}>
              Total products: {marketStats?.totalCustomers}
            </Typography>
          </Box>
        </Box>
        <hr />
        
      </Box>
      <>
        {openRestoreProductsModal && <RestoreProducts {...{ openRestoreProductsModal, setRestoreProductsModal, getAdminStatistics}} />}
        {openRestoreUsersModal && <RestoreUsersModal {...{ openRestoreUsersModal, setRestoreUsersModal, getMarketStatistics}} />}
      </>
    </div>
  )
}

export default Backup