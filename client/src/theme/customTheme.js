import { createTheme } from "@mui/material";
import { typography } from "./typography";
import { MuiCssBaseline } from "./components";
import { MuiDataGrid } from "./components";
import { MuiPaper } from "./components";
import { MuiButton } from "./components";
import { MuiCard } from "./components";
import { palette } from "./colors";

export const customTheme = createTheme({
  palette,
  typography,
  components: {
    MuiCssBaseline,
    MuiPaper,
    MuiButton,
    MuiDataGrid,
    MuiCard,
  },
});
