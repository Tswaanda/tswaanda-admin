import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Button,
  Typography,
  Rating,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../components/Header";

import UpLoadProduct from "../../scenes/upload";
import UpdateProduct from "../update/index";
import { backendActor } from "../../config";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteAsset } from "../../storage-config/functions";

const Product = ({
  id,
  name,
  shortDescription,
  price,
  images,
  minOrder,
  fullDescription,
  rating,
  category,
  supply,
  stat,
  weight,
  availability,

  setProductsUpdated,
}) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const [deletingAssets, setDeleting] = useState(false)
  const [imgCount, setImgCount] = useState(null)
  const [deletingProduct, setDelProduct] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateButton = () => {
    setIsOpen(true);
  };

  const handleUpdatePopClose = () => {
    setIsOpen(false);
  };

  const productInfo = {
    id,
    name,
    price,
    minOrder,
    shortDescription,
    fullDescription,
    category,
    images,
    weight,
    availability
  };

  const handleDelete = async () => {
    try {
      await deleteAssetsUrls(images)
      setDelProduct(true)
      await backendActor.deleteProduct(id);
      setDelProduct(false)
      setProductsUpdated(true);
      handleClose()
    } catch (error) {
      console.log(error)
    }
  };

  const deleteAssetsUrls = async (urls) => {
    setDeleting(true)
    setImgCount(urls.length)
    for (const url of urls) {
      console.log("Deleting this url", url)
      await deleteAsset(url);
      setImgCount(prevCount => prevCount - 1);
    }
    setDeleting(false)
  };

  const formatOrderDate = (timestamp) => {
    const milliseconds = Number(timestamp) / 1000000;
    const date = new Date(milliseconds);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <Card
      sx={{
        backgroundImage: "none",
        backgroundColor: theme.palette.background.alt,
        borderRadius: "0.55rem",
      }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          color={theme.palette.secondary[400]}
          gutterBottom
        >
          {category}
        </Typography>
        <Typography variant="h5" component="div">
          {name}
        </Typography>
        <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
          ${Number(price).toFixed(2)}
        </Typography>
        <Rating value={rating} readOnly />
        <Typography variant="body2">{shortDescription}</Typography>
        {/* <Typography sx={{ color: "text.secondary" }}>
          <span> <span style={{ fontWeight: "bold" }}>Date</span>:
            {formatOrderDate(dateCreated)}</span>


        </Typography> */}
      </CardContent>
      <CardActions>
        <Button
          variant="primary"
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          See More
        </Button>
        <Button
          variant="primary"
          size="small"
          onClick={handleUpdateButton}
        // onClick={() => setIsExpanded(!isExpanded)}
        >
          Update
        </Button>
        {isOpen && (
          <UpdateProduct
            productInfo={productInfo}
            setProductsUpdated={setProductsUpdated}
            isOpen={isOpen}
            onClose={handleUpdatePopClose}
          />
        )}
        <Button variant="primary" size="small" onClick={handleClickOpen}>
          <DeleteIcon />
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Are you sure want to delete this product?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Name: {name}, Price: {price}, {availability}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {!deletingAssets && !deletingProduct && <Button onClick={handleClose}>Cancel</Button>}
            <Button onClick={handleDelete} autoFocus>
              {deletingAssets && `Deleting images... ${imgCount}`}
              {deletingProduct && `Deleting Product...`}
              {!deletingAssets && !deletingProduct && "Yes I'm sure"}
            </Button>
          </DialogActions>
        </Dialog>
      </CardActions>
      <Collapse
        in={isExpanded}
        timeout="auto"
        unmountOnExit
        sx={{ color: theme.palette.neutral[300] }}
      >
        <CardContent>
          <Typography>id: {id}</Typography>
          <Typography>Supply Left: {supply}</Typography>
          <Typography>
            Yearly Sales This Year: {stat.yearlySaleTotal}
          </Typography>
          <Typography>
            Yearly Units Sold This Year: {stat.yearlyTotalSoldUnits}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

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
          {products?.map(
            ({
              id,
              name,
              minOrder,
              shortDescription,
              fullDescription,
              price,
              category,
              images,
              availability,
              weight
            }) => (
              <Product
                key={id}
                {...{ id, name, minOrder, shortDescription, fullDescription, images, price, rating: Number(4), category, stat: "stats", setProductsUpdated, availability, weight }}
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
