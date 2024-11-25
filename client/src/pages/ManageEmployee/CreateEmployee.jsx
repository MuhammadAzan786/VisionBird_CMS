import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

export default function CreateEmployee() {
  return (
    <Button
      variant="contained"
      component={Link}
      size="medium"
      to={"/create-employee"}
    >
      <AddIcon
        sx={{
          transition: "transform 0.3s",
          mr: 1,
        }}
      />
      Add Employee
    </Button>
  );
}
