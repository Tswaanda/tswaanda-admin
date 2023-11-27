import React, { useEffect, useState } from "react";
import {
    Card,
    CardActions,
    CardContent,
    Collapse,
    Button,
    Typography,
    Rating,
    useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { backendActor } from "../../config";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteAsset } from "../../storage-config/functions";
import UpdateProduct from "../../scenes/update/index";
import MoreInfo from "./MoreInfo";

const Product = ({
    product,
    setProductsUpdated,
}) => {
    const theme = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [openMoreModal, setMoreModal] = useState(false);
    const [reviews, setReviews] = useState([]);

    const [deletingAssets, setDeleting] = useState(false)
    const [imgCount, setImgCount] = useState(null)
    const [deletingProduct, setDelProduct] = useState(false)
    const [rateValue, setRateValue] = useState(0);

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

    const getProductReviews = async () => {
        const res = await backendActor.getProductReviews(product.id);
        if (Array.isArray(res)) {
            const sortedReviews = res.sort(
            (b, a) => Number(a.rating) - Number(b.rating)
            );
            setReviews(sortedReviews);
        }
    };

    useEffect(() => {
        getProductReviews();
    }, [product]);

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) {
            return 0;
        }
    
        const totalRating = reviews.reduce((accumulator, review) => {
            return accumulator + Number(review.rating);
        }, 0);
        const averageRating = totalRating / reviews.length;
    
        const roundedAverage = Math.round(averageRating * 10) / 10;
    
        return roundedAverage;
    };

    const ratingValue = (reviews) => {
        if (!reviews || reviews.length === 0) {
            return 0;
        }
    
        const totalRating = reviews.reduce((accumulator, review) => {
            return accumulator + Number(review.rating);
        }, 0);
    
        const averageRating = totalRating / reviews.length;
    
        const roundedAverage = Math.round(averageRating);
    
        setRateValue(roundedAverage);
    };
    
    useEffect(() => {
        ratingValue(reviews);
    }, [reviews]);

    const handleDelete = async () => {
        try {
            await deleteAssetsUrls(product.images)
            setDelProduct(true)
            await backendActor.deleteProduct(product.id);
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
                    {product.category}
                </Typography>
                <Typography variant="h5" component="div">
                    {product.name}
                </Typography>
                <Typography sx={{ mb: "1.5rem" }} color={theme.palette.secondary[400]}>
                    ${Number(product.price).toFixed(2)}
                </Typography>
                <Rating value={rateValue} readOnly />
                <Typography variant="body2">{product.shortDescription}</Typography>
                {/* <Typography sx={{ color: "text.secondary" }}>
            <span> <span style={{ fontWeight: "bold" }}>Date</span>:
            {formatOrderDate(dateCreated)}</span>

          </Typography> */}
            </CardContent>
            <CardActions>
                <Button
                    variant="primary"
                    size="small"
                    onClick={() => setMoreModal(true)}
                >
                    See More
                </Button>
                <Button
                    variant="primary"
                    size="small"
                    onClick={handleUpdateButton}
                >
                    Update
                </Button>
                {isOpen && (
                    <UpdateProduct
                        productInfo={product}
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
                            Name: {product.name}, Price: {product.price}, {product.availability}
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
            {openMoreModal && <MoreInfo {...{ openMoreModal, setMoreModal, product, reviews }} />}
        </Card>
    );
};

export default Product;