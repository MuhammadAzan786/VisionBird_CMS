import { styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export const CustomDataGrid = styled(DataGrid)(({ theme }) => ({
  height: "480px",
  "&.MuiDataGrid-root": {
    fontFamily: "Poppins, sans-serif",
    border: "none",
  },
  "& .MuiDataGrid-row:hover": {
    backgroundColor: "#f8f9fa",
  },
  ".MuiDataGrid-columnHeaderTitle": {
    fontWeight: "500 !important",
  },
  "& .MuiDataGrid-cell[data-field='employee_sallary']": {
    fontWeight: 500,
  },

  "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-filler,.MuiDataGrid-filler div, .MuiDataGrid-footerContainer":
    {
      border: "none !important",
    },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
  "& ::-webkit-scrollbar": {
    backgroundColor: "transparent",
    height: 10,
    width: 10,
  },
  "& ::-webkit-scrollbar-track": {
    boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
    borderRadius: "10px",
    backgroundColor: "#F5F5F5",
  },
  "& ::-webkit-scrollbar-thumb": {
    borderRadius: "10px",
    boxShadow: "inset 0 0 6px rgba(0,0,0,.3)",
    backgroundColor: " #555",
    width: "0px",
  },
  "& .MuiDataGrid-scrollbar--vertical": {
    opacity: "",
  },
  "& .MuiDataGrid-overlayWrapperInner": { position: "relative" },
}));
