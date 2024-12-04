import { colors } from "@mui/material";
import PoppinsThin100 from "../assets/fonts/100-Poppins-Thin.ttf";
import PoppinsExtraLight200 from "../assets/fonts/200-Poppins-ExtraLight.ttf";
import PoppinsLight300 from "../assets/fonts/300-Poppins-Light.ttf";
import PoppinsRegular400 from "../assets/fonts/400-Poppins-Regular.ttf";
import PoppinsMedium500 from "../assets/fonts/500-Poppins-Medium.ttf";
import PoppinsSemiBold600 from "../assets/fonts/600-Poppins-SemiBold.ttf";
import { customColors, palette } from "./colors";
//   ========================== Css BaselINE Component =========================

export const MuiCssBaseline = {
  styleOverrides: ` @font-face{
         font-family: 'Poppins';
            font-style: normal;
            font-weight: 100;
            src: url(${PoppinsThin100}) format('truetype');}
        @font-face{
         font-family: 'Poppins';
            font-style: normal;
            font-weight: 200;
            src: url(${PoppinsExtraLight200}) format('truetype');}
        @font-face{
         font-family: 'Poppins';
            font-style: normal;
            font-weight: 300;
            src: url(${PoppinsLight300}) format('truetype');}
        @font-face{
         font-family: 'Poppins';
            font-style: normal;
            font-weight: 400;
            src: url(${PoppinsRegular400}) format('truetype');}
        @font-face{
         font-family: 'Poppins';
            font-style: normal;
            font-weight: 500;
            src: url(${PoppinsMedium500}) format('truetype');}
        @font-face{
         font-family: 'Poppins';
            font-style: normal;
            font-weight: 600;
            src: url(${PoppinsSemiBold600}) format('truetype');}`,
};

//   ========================== Paper Component =========================
export const MuiPaper = {
  defaultProps: {
    elevation: 0,
  },
  styleOverrides: {
    root: {
      variants: [
        {
          props: { square: false },
          style: {
            borderRadius: "8px",
            padding: "30px",
          },
        },
      ],
    },
  },
};

//   ========================== Button Component =========================

export const MuiButton = {
  defaultProps: {
    disableElevation: true,
  },
  root: {
    borderRadius: "8px",
    transition: "background-color 0.2s ease-in-out, transform 0.2s ease-in-out",
    color: "white !important",
    "&:hover": {
      transform: "scale(1.03)",
      "& .MuiSvgIcon-root": {
        transform: "scale(1.3)",
      },
    },
  },
};

//   ========================== Card Component =========================

export const MuiCard = {
  styleOverrides: {
    root: {
      border: "2px solid",
      borderColor: palette.borderColor.main,
      borderRadius: "8px",
      transition: "border-color 0.3s ease",
      padding: "20px",
    },
  },
};
//   ========================== Data Grid Component =========================

export const MuiDataGrid = {
  defaultProps: {
    disableColumnMenu: true,
    // hideFooter: true,
    rowHeight: 80,
    columnHeaderHeight: 45,
    disableColumnSorting: true,
  },
  styleOverrides: {
    root: {
      padding: 0,
      border: "1px solid #e8ebee",
      height: "500px",

      "& .MuiDataGrid-columnHeaders": {
        backgroundColor: `${palette.primary.main}`,
        color: `${palette.common.white}`,
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
        backgroundColor: `${palette.primary.main}`,
        width: "0px",
      },
    },
  },
};
