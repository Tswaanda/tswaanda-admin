import React from "react";
import { Box, useTheme } from "@mui/material";
// import { useGetUserPerformanceQuery } from "../../state/api";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header";
import CustomColumnMenu from "../../components/DataGridCustomColumnMenu";
import { RootState } from "../../state/Store";

const Performance = () => {
    const theme = useTheme();
   let userId = null
   let data = null
    let isLoading = false
    // const { data, isLoading } = useGetUserPerformanceQuery(userId);

    const columns = [
        {
        field: "_id",
        headerName: "ID",
        flex: 1,
        },
        {
        field: "userId",
        headerName: "User ID",
        flex: 1,
        },
        {
        field: "createdAt",
        headerName: "CreatedAt",
        flex: 1,
        },
        {
        field: "products",
        headerName: "# of Products",
        flex: 0.5,
        sortable: false,
        renderCell: (params:any) => params.value.length,
        },
        {
        field: "cost",
        headerName: "Cost",
        flex: 1,
        renderCell: (params:any) => `$${Number(params.value).toFixed(2)}`,
        },
    ];

    return (
        <Box m="1.5rem 2.5rem">
            <Header
                title="PERFORMANCE"
                subtitle="Affiliate Sales Performance"
            />
            <Box
                mt="40px"
                height="75vh"
                sx={{
                "& .MuiDataGrid-root": {
                    border: "none",
                },
                "& .MuiDataGrid-cell": {
                    borderBottom: "none",
                },
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: theme.palette.background.default,
                    color: (theme.palette.secondary as any)[100],
                    borderBottom: "none",
                },
                "& .MuiDataGrid-virtualScroller": {
                    backgroundColor: theme.palette.primary.light,
                },
                "& .MuiDataGrid-footerContainer": {
                    backgroundColor: theme.palette.background.default,
                    color: (theme.palette.secondary as any)[100],
                    borderTop: "none",
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                    color: `${(theme.palette.secondary as any)[200]} !important`,
                },
                }}
            >
                {/* <DataGrid
                    loading={isLoading || !data}
                    getRowId={(row) => row._id}
                    rows={(data && data.sales) || []}
                    columns={columns}
                    components={{
                        ColumnMenu: CustomColumnMenu,
                    }}
                /> */}
            </Box>
        </Box>
    );
};

export default Performance;
