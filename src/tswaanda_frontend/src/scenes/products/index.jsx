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



const Products = () => {
  const theme = useTheme();

  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productsUpdated, setProductsUpdated] = useState(false);

  const getProducts = async () => {
    setLoading(true);
    const products = await backendActor.getAllProducts();
    setProducts(products);
    setLoading(false);
    setProductsUpdated(false);
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
                {...{product, stat: "stats", setProductsUpdated}}
              />
            )
          )}
        </Box>
      ) : (
        <>Loading...</>
      )}
    </Box>
  );
};

export default Products;
