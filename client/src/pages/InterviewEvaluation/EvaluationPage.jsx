import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axiosInterceptor";
import { useMessage } from "../../components/MessageContext";
import { Box, Button, Grid, Typography, Paper, Backdrop } from "@mui/material";
import Rating from "@mui/material/Rating";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import Avatar from "@mui/material/Avatar";

import AssignmentIcon from "@mui/icons-material/Assignment";
import StarIcon from "@mui/icons-material/Star";
import EventIcon from "@mui/icons-material/Event";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DescriptionIcon from "@mui/icons-material/Description";
import LoadingAnim from "../../components/LoadingAnim";

const EvaluationPage = () => {
  const { showMessage } = useMessage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSuccess = () => {
    showMessage("success", "Evaluation Deleted successfully!");
  };

  const handleError = () => {
    showMessage("error", "Evaluation Deletion failed!");
  };

  const getEvaluation = async () => {
    try {
      const response = await axios.get(`/api/interview/${id}`);
      setEvaluation(response.data);
      console.log("Evaluation fetched successfully:", response.data);
    } catch (error) {
      console.error("Error fetching evaluation data:", error);
    }
  };

  useEffect(() => {
    getEvaluation();
    console.log(evaluation);
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    await axios
      .delete(`/api/interview/delete_evaluation/${id}`)
      .then(() => {
        handleSuccess();
        setLoading(false);
        navigate("/interview-evaluation");
      })
      .catch((error) => {
        handleError();
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const dateformat = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const appliedOn = evaluation?.appliedOn
    ? dateformat(evaluation.appliedOn)
    : "N/A";
  const interviewCall = evaluation?.testRating
    ? dateformat(evaluation.testRating)
    : "N/A";
  return (
    <Box p={3}>
      <Grid
        item
        xs={12}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        fontSize={20}
      >
        <Link to={"/interview-evaluation"}>
          <Button startIcon={<KeyboardReturnIcon color="primary" />}>
            Back to Evaluation Table
          </Button>
        </Link>

        <Button variant="outlined" color="error" onClick={handleDelete}>
          Delete Evaluation
        </Button>
      </Grid>

      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Grid container direction={"column"}>
            {/* BIO Section */}
            <Grid item mt={2} p={4} component={Paper}>
              <Grid container gap={1} direction="column">
                <Grid item>
                  <Typography
                    variant="h4"
                    fontSize={20}
                    fontWeight={700}
                    gutterBottom
                  >
                    BIO
                  </Typography>
                </Grid>
                {[
                  {
                    icon: <PersonIcon color="primary" />,
                    label: "Name",
                    value: evaluation.name,
                  },
                  {
                    icon: <EmailIcon color="secondary" />,
                    label: "Email",
                    value: evaluation.email,
                  },
                  {
                    icon: <PhoneIcon color="success" />,
                    label: "Mobile #",
                    value: evaluation.contact,
                  },
                  {
                    icon: <BadgeIcon color="info" />,
                    label: "CNIC",
                    value: evaluation.CNIC,
                  },
                ].map(({ icon, label, value }, index) => (
                  <Grid
                    item
                    key={index}
                    sx={{ color: "text.secondary" }}
                    fontWeight={600}
                  >
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                        gap: 0.5,
                      }}
                    >
                      {icon} {label}:{" "}
                      <Typography variant="body1" component={"span"}>
                        {value}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* BACKGROUND Section */}
            <Grid item mt={2} p={4} component={Paper}>
              <Grid container gap={1} direction="column">
                <Grid item>
                  <Typography
                    variant="h4"
                    fontSize={20}
                    fontWeight={700}
                    gutterBottom
                  >
                    BACKGROUND
                  </Typography>
                </Grid>
                {[
                  {
                    icon: <SchoolIcon color="primary" />,
                    label: "Qualification",
                    value: evaluation.qualification,
                  },
                  {
                    icon: <WorkIcon color="warning" />,
                    label: "Experience",
                    value: evaluation.workExp,
                  },
                ].map(({ icon, label, value }, index) => (
                  <Grid
                    item
                    key={index}
                    sx={{ color: "text.secondary" }}
                    fontWeight={600}
                  >
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                        gap: 0.5,
                      }}
                    >
                      {icon} {label}:{" "}
                      <Typography variant="body1" component={"span"}>
                        {value}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* EXPERTISE Section */}
            <Grid item mt={2} p={4} component={Paper}>
              <Grid container gap={1} direction="column">
                <Grid item>
                  <Typography
                    variant="h4"
                    fontSize={20}
                    fontWeight={700}
                    gutterBottom
                  >
                    EXPERTISE
                  </Typography>
                </Grid>
                <Grid item>
                  <Grid
                    fontWeight={600}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      gap: 0.5,
                      color: "text.secondary",
                    }}
                  >
                    <BusinessCenterIcon color="primary" /> Skills:{" "}
                    <Typography variant="body1" component={"span"}>
                      {evaluation.expertiseAndSkills}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* POSITION and RATING Section */}
        <Grid item md={6} xs={12}>
          <Grid container direction={"column"}>
            {/* POSITION Section */}
            <Grid item mt={2} p={4} component={Paper}>
              <Grid container gap={2} direction="column">
                <Grid item>
                  <Typography
                    variant="h4"
                    fontSize={20}
                    fontWeight={700}
                    gutterBottom
                  >
                    POSITION
                  </Typography>
                </Grid>
                {[
                  {
                    icon: <AssignmentIcon color="secondary" />,
                    label: "Applying For",
                    value: evaluation.applyFor,
                  },
                  {
                    icon: <AssignmentIcon color="secondary" />,
                    label: "Internship Type",
                    value: evaluation.internshipType,
                  },
                  {
                    icon: <EventIcon color="info" />,
                    label: "Applied On",
                    value: appliedOn,
                  },
                  {
                    icon: <EventIcon color="info" />,
                    label: "Interview Call",
                    value: interviewCall,
                  },
                ].map(({ icon, label, value }, index) => (
                  <Grid
                    item
                    key={index}
                    sx={{ color: "text.secondary" }}
                    fontWeight={600}
                  >
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                        gap: 0.5,
                      }}
                    >
                      {icon} {label}:{" "}
                      <Typography variant="body1" component={"span"}>
                        {value}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* RATING Section */}
            <Grid item mt={2} p={4} component={Paper}>
              <Grid container direction="column" gap={1}>
                <Grid item>
                  <Typography
                    variant="h4"
                    fontSize={20}
                    fontWeight={700}
                    gutterBottom
                  >
                    RATING
                  </Typography>
                </Grid>
                {[
                  {
                    label: "Interview Rating",
                    value: evaluation.interviewRating,
                  },
                  { label: "Test Rating", value: evaluation.testRating },
                  { label: "Overall Rating", value: evaluation.overallRating },
                ].map(({ label, value }, index) => (
                  <Grid
                    item
                    key={index}
                    sx={{ color: "text.secondary" }}
                    fontWeight={600}
                  >
                    <Grid
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "start",
                        gap: 0.5,
                      }}
                    >
                      <StarIcon sx={{ color: "#faaf00" }} />{" "}
                      {/* Adjust the color as needed */}
                      <Typography
                        sx={{ color: "text.secondary", fontWeight: 600 }}
                      >
                        {label}:
                      </Typography>
                      <Rating value={Number(value) || 0} readOnly />
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* STIPEND Section */}
            <Grid item mt={2} p={4} component={Paper}>
              <Grid container direction="column" gap={2}>
                <Grid item>
                  <Typography
                    variant="h4"
                    fontSize={20}
                    fontWeight={700}
                    gutterBottom
                  >
                    STIPEND
                  </Typography>
                </Grid>
                <Grid item sx={{ color: "text.secondary" }} fontWeight={600}>
                  <Grid
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      gap: 0.5,
                    }}
                  >
                    <AttachMoneyIcon sx={{ color: "#4caf50" }} />{" "}
                    {/* Green color */}
                    Expected Stipend:{" "}
                    <Typography variant="body1" component={"span"}>
                      {evaluation.expectedStipend}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* DOCUMENTS Section */}
      <Grid item mt={2} p={4} component={Paper}>
        <Grid container direction="column" gap={1}>
          <Grid item>
            <Typography
              variant="h4"
              fontSize={20}
              fontWeight={700}
              gutterBottom
            >
              DOCUMENTS
            </Typography>
          </Grid>
          <Grid item>
            <Grid
              fontWeight={600}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
                gap: 0.5,
                color: "text.secondary",
              }}
            >
              <a href={evaluation.CvUpload} target="_blank">
                <Button
                  sx={{
                    color: "primary",
                    textTransform: "capitalize",
                    fontWeight: 600,
                    fontSize: 14,
                    borderRadius: 4,
                    "&:hover": {},
                  }}
                >
                  <DescriptionIcon sx={{ color: "#1976d2" }} />{" "}
                  {/* Adjust color */}
                  Open Resume/Cv
                </Button>
              </a>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <LoadingAnim />
        </Backdrop>
      )}
    </Box>
  );
};

export default EvaluationPage;
