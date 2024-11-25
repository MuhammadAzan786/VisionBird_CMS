import { Avatar, Box, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";
import dummyImg from "../../assets/images/dummy.jpg";

const EmployeeNameCell = ({ src = dummyImg, name = "", userId = "" }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        gap: 1,
      }}
    >
      <Avatar
        src={src}
        alt="avatar"
        sx={{ border: "5px solid #F5F5F5", width: 50, height: 50 }}
      />
      <Stack sx={{ alignItems: "start", gap: "0" }}>
        <Typography
          fontWeight={500}
          fontSize={15}
          sx={{ fontFamily: "Poppins, sans-serif" }}
        >
          {name}
        </Typography>
        <Typography color="#a0a0a0" fontSize={12}>
          {userId}
        </Typography>
      </Stack>
    </Box>
  );
};

EmployeeNameCell.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  userId: PropTypes.string,
};

export default EmployeeNameCell;
