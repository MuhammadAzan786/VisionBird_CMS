import { Chip, chipClasses, styled } from "@mui/material";
import { colorCombinations, customColors } from "../../theme/colors";

export const CustomChip = styled(Chip)(({ status, theme }) => {
  let chipStyles = {};

  switch (status) {
    case "rejected":
    case "unpaid":
    case "admin":
    case "refused":
    case "no":
    case "Urgent":
      chipStyles = colorCombinations.red;
      break;
    case "approved":
    case "paid":
    case "appeared":
    case "yes":
    case "Normal":
      chipStyles = colorCombinations.green;
      break;
    case "pending":
    case "manager":
    case "internship":
    case "noResponse":
      chipStyles = colorCombinations.yellow;
      break;
    case "employee":
    case "permanent":
    case "notAppeared":
      chipStyles = colorCombinations.purple;
      break;
    case "active":
      chipStyles = {
        color: theme.palette.primary.main,
        backgroundColor: "transparent",
        border: `1px solid ${theme.palette.primary.main}`,
      };
      break;
    case "completed":
      chipStyles = {
        color: customColors.green,
        backgroundColor: "transparent",
        border: `1px solid ${customColors.green}`,
      };
      break;
    default:
      chipStyles = colorCombinations.default;
  }
  return {
    minWidth: "80px",
    ...chipStyles,
    [`& .${chipClasses.icon}`]: {
      color: chipStyles.color,
    },
  };
});
