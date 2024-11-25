import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInterceptor";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";

export default function TaxFileView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [responseData, setResponseData] = useState({});

  const handlenavigation = () => {
    navigate(-1);
  };

  useEffect(() => {
    axios
      .get(`/api/tax_File/get_file/${id}`)
      .then((response) => {
        console.log(response.data);
        setResponseData(response.data); // Set the entire response data
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Box p={3}>
        <Button startIcon={<KeyboardReturnIcon />} onClick={handlenavigation}>
          Back to tax Files
        </Button>

        <Grid container spacing={5} style={{ marginTop: "20px" }}>
          {/* {responseData.file.length} */}
          {responseData.file &&
            responseData.file.map((file, index) => (
              <Grid item xs={4} sm={3} md={3} lg={2} key={index}>
                <Box
                  component={Paper}
                  elevation={3}
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  border={1}
                  borderColor={"gray"}
                  paddingY={3}
                  sx={{
                    backgroundColor: "rgba(0, 0, 0, 0.03)",
                    borderRadius: "5px 5px 5px 5px",
                  }}
                >
                  {(() => {
                    let icon = null;
                    let color = null;
                    const fileExtension = file.originalName
                      .split(".")
                      .pop()
                      .toLowerCase();
                    console.log(fileExtension);
                    if (fileExtension === "jpeg" || fileExtension === "jpg") {
                      icon = (
                        <PermMediaIcon
                          style={{
                            fontSize: 70,
                            textAlign: "center",
                            marginBottom: 10,
                          }}
                        />
                      );
                      color = "success";
                    } else if (fileExtension === "pdf") {
                      icon = (
                        <PictureAsPdfIcon
                          style={{
                            fontSize: 70,
                            textAlign: "center",
                            marginBottom: 10,
                          }}
                        />
                      );
                      color = "error";
                    } else {
                      icon = (
                        <DescriptionIcon
                          style={{
                            fontSize: 70,
                            textAlign: "center",
                            marginBottom: 10,
                          }}
                        />
                      );
                      color = "secondary";
                    }

                    return icon ? React.cloneElement(icon, { color }) : null;
                  })()}

                  <Typography fontWeight={700}>{file.file_date}</Typography>
                </Box>
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
}
