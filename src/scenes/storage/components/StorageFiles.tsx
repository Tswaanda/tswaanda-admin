import React, { useEffect, useState } from "react";
import {
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Container,
    Typography,
    useTheme,
    Grid,
    CardActions,
    TextField,
    Tabs,
    Tab,
    Button,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// ts-ignore
import { deleteAsset, getAllAssets } from "../../../storage-config/functions";
import { Asset } from "../../../declarations/file_storage/file_storage.did";

const StorageFiles = () => {
    const theme = useTheme();
    const [expanded, setExpanded] = useState("");
    const handleChange = (panel: any) => (isExpanded: any) => {
        setExpanded(isExpanded ? panel : false);
    };
    const [files, setFiles] = useState<Asset[]>([])

    const formatOrderDate = (timestamp: number): string => {
        const milliseconds = timestamp / 1000000;
        const date = new Date(milliseconds);
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true
        };
        return date.toLocaleDateString(undefined, options);
    };
    

    useEffect(() => {
        const getFiles = async () => {
            const files = await getAllAssets()
            if (files.ok) {
                const sortedFiles = files.ok
                    .filter((file: any) => file.created !== undefined)
                    .sort((a: any, b: any) => Number(b.created) - Number(a.created));
                setFiles(sortedFiles);
                console.log(sortedFiles);
            } else {
                console.log(files.err)
            }
        }
        getFiles()
    }, [])

    

    const handleDeleteFile = async (url: string): Promise<void> => {
        setFiles(prevFiles => prevFiles.filter(file => file.url !== url));
         await deleteAsset(url);
    }
    

    return (
        <Box m="1rem 0 0 0">
            <Grid container spacing={2}>
                {files?.map((file) => (
                    <Grid key={file.id} item xs={4}>
                        <Accordion
                            key={file.id}
                            expanded={expanded === file.id}
                            onChange={handleChange(file.id)}
                            sx={{ backgroundColor: theme.palette.background.default }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography sx={{ color: "text.secondary" }}>
                                    <span> <span style={{ fontWeight: "bold" }}>Date</span>:
                                        {formatOrderDate(Number(file.created))}</span>
                                    <br />
                                    <span><span style={{ fontWeight: "bold" }}>Filename</span>:{" "}
                                        {file.filename}</span>

                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box
                                    sx={{
                                        backgroundImage: "none",
                                        backgroundColor: theme.palette.background.default,
                                        borderRadius: "0.55rem",
                                    }}
                                >
                                    <Grid container spacing={4} m="0 0.1rem 0 0.1rem">

                                        <Grid item xs={4} display="flex" alignItems="center">
                                            <Box
                                                component="img"
                                                alt="profile"
                                                src={file.url}
                                                height="100px"
                                                width="100px"
                                                sx={{ objectFit: "cover" }}
                                            />
                                            <Box m="0 0.1rem 0 0.1rem" textAlign="left">
                                                <Typography
                                                    fontSize="0.9rem"
                                                    sx={{ color: (theme.palette.secondary as any)[100] }}
                                                >
                                                    Name: {file.filename}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                    </Grid>
                                    <hr />
                                    <CardActions>
                                        <Button
                                            onClick={() => handleDeleteFile(file.url)}
                                            variant="outlined"
                                            size="small"
                                            style={{
                                                color: "white",
                                            }}
                                        >
                                            Delete file
                                        </Button>
                                    </CardActions>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default StorageFiles