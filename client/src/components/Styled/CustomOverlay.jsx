import { Backdrop } from "@mui/material";
import LoadingAnim from "../LoadingAnim";
import PropTypes from "prop-types";

const CustomOverlay = ({ open }) => {
  return (
    <Backdrop
      sx={(theme) => ({
        color: "#fff",
        zIndex: theme.zIndex.drawer + 1,
      })}
      open={open}
    >
      <LoadingAnim />
    </Backdrop>
  );
};

CustomOverlay.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default CustomOverlay;
