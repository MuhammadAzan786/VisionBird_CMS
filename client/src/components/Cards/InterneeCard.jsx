import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInterceptor";

import interneeSvg from "/internee.svg";

function InterneeCard() {
  const [internees, setInternees] = useState([]);

  const getInternee = async () => {
    try {
      const response = await axios.get(
        "/api/internee/get_internees"
      );
      setInternees(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInternee();
  }, []);

  return (
    <div>
      <Card
        sx={{
          borderRadius: "10px",
          boxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
          WebkitBoxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
          MozBoxShadow: "-1px 2px 12px 0px rgba(0,0,0,0.15)",
          position: "relative",
          "&:hover": {
            boxShadow: "-2px 1px 20px 0px rgba(0,0,0,0.15)",
            WebkitBoxShadow: "-2px 1px 20px 0px rgba(0,0,0,0.15)",
            MozBoxShadow: "-2px 1px 20px 0px rgba(0,0,0,0.15)",
          },
          "&:hover .hover-line": {
            height: "4px",
            backgroundColor: "#FDB528",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            padding: "5px",
            paddingY: "17px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "auto",
              height: "auto",
            }}
          >
            <Box backgroundColor="#FFF3DD" borderRadius={"5px"} padding={"8px"}>
              <img
                src={interneeSvg}
                alt="My SVG"
                style={{
                  width: "35px",
                  height: "35px",
                  filter:
                    " brightness(0) saturate(100%) invert(86%) sepia(21%) saturate(5814%) hue-rotate(338deg) brightness(105%) contrast(98%)",
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{ fontSize: 13, fontWeight: 500 }}
                variant="h5"
                component="h2"
                textAlign={"center"}
              >
                NO. of Internees
              </Typography>
              <Typography
                sx={{ fontWeight: 600, color: "#666666" }}
                variant="h3"
                component="p"
              >
                {internees.length}
              </Typography>
            </Box>
          </Box>
        </CardContent>
        <Box
          className="hover-line"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "2px",
            backgroundColor: "#FDB528",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            transition: "all 0.3s ease-in-out",
          }}
        />
      </Card>
    </div>
  );
}

export default InterneeCard;
