import { Box, Typography } from "@mui/material";
import vbtLogo from "/vbt-logo.png";
import { Link } from "react-router-dom";

const FormHeader = ({ title }) => {
  return (
    <>
      <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"} pt={5} pb={3}>
        <Box pb={1}>
          <img src={vbtLogo} alt="" width={380} />
        </Box>
        <Typography variant="body2" textAlign={"center"}>
          B-343, Pagganwala Street, Near Cheema Masjid, Shadman Colony, Gujrat, Pakistan.
        </Typography>
        <Typography variant="body2" textAlign={"center"}>
          Mobile: 0322-5930603, 0346-5930603, Landline: 053-3709168, 053-3728469
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2">
            URL:
            <Link href="https://www.example.com" target="_blank" rel="noopener" sx={{ marginLeft: 1 }}>
              https://www.visionbird.com
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ paddingLeft: 1 }}>
            Email:
            <Link href="https://www.example.com" target="_blank" rel="noopener" sx={{ marginLeft: 1 }}>
              info@visionbird.com
            </Link>
          </Typography>
        </Box>
      </Box>
      <Typography fontSize={25} fontWeight={500} mb={6} p={2} color={"white"} textAlign="center" bgcolor="primary.main">
        {title}
      </Typography>
    </>
  );
};

export default FormHeader;
