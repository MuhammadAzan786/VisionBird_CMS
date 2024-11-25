import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

const CreateInternee = () => {
  return (
    <div>
      <Button
        variant="contained"
        component={Link}
        size="medium"
        to={"/create-internee"}
        sx={{}}
      >
        <AddIcon
          sx={{
            transition: "transform 0.3s",
            mr: 1,
          }}
        />
        Add Internee
      </Button>
    </div>
  );
};

export default CreateInternee;
