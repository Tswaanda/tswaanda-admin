import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Header from "../../components/Header";

import UpLoadProduct from "../../scenes/upload";
import { backendActor } from "../../config";
import Product from "../../components/Products/Product";
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RestoreProducts from "./RestoreProducts";



const Products = () => {
  const theme = useTheme();

  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productsUpdated, setProductsUpdated] = useState(false);
  const [openRestoreModal, setRestoreModal] = useState(false);

  const getProducts = async () => {
    try {
      setLoading(true);
      const products = await backendActor.getAllProducts();
      setProducts(products);
      setLoading(false);
      setProductsUpdated(false);
    } catch (error) {
      console.log("An error occurred while getting products:", error)
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (productsUpdated) {
      getProducts();
    }
  }, [productsUpdated]);

  const isNonMobile = useMediaQuery("(min-width: 1000px)");

  const [isOpen, setIsOpen] = useState(false);

  const handleUpLoadButton = () => {
    setIsOpen(true);
  };

  const handleUpLoadPopClose = () => {
    setIsOpen(false);
  };

  const handleBackup = async () => {
    const products = await backendActor.getAllProducts();
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(products));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "products.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  return (
    <Box m="1.5rem 2.5rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="PRODUCTS" subtitle="List of products." />
        <Button
          variant="contained"
          onClick={handleUpLoadButton}
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.background.alt,
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          <AddIcon sx={{ mr: "10px" }} />
          Add New Product
        </Button>
        {isOpen && (
          <UpLoadProduct
            setProductsUpdated={setProductsUpdated}
            isOpen={isOpen}
            onClose={handleUpLoadPopClose}
          />
        )}
      </Box>
      <Box display="flex" justifyContent="end" alignItems="center">
        <Button
          variant="contained"
          onClick={handleBackup}
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
          Backup to JSON
        </Button>
        <Button
          variant="contained"
          onClick={() => setRestoreModal(true)}
          sx={{
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.background.alt,
            fontSize: "14px",
            fontWeight: "bold",
            padding: "10px 20px",
          }}
        >
          < FileUploadIcon sx={{ mr: "10px" }} />
          Restore from JSON
        </Button>
      </Box>


      {products || !loading ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {products?.map((product, index) => (
            <Product
              key={index}
              {...{ product, stat: "stats", setProductsUpdated }}
            />
          )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
      <>
        {openRestoreModal && <RestoreProducts {...{ openRestoreModal, setRestoreModal, setProductsUpdated }} />}
      </>
    </Box>
  );
};

export default Products;
