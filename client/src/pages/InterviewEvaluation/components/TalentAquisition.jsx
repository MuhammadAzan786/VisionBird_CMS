import {
  Autocomplete,
  Box,
  Grid,
  Slider,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { KeyboardArrowDown, RadioButtonChecked } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "../../../utils/axiosInterceptor";

import PropTypes from "prop-types";
import { CustomChip } from "../../../components/Styled/CustomChip";
import {
  salaryformatter,
  shortDateWithMonthName,
  WordCaptitalize,
} from "../../../utils/common";
import { CheckAxiosError } from "../../../utils/checkAxiosError";
import CustomOverlay from "../../../components/Styled/CustomOverlay";
import { customColors } from "../../../theme/colors";
import { DataGrid } from "@mui/x-data-grid";

const qualificationOptions = [
  { label: "All", id: "all" },
  { label: "Matriculation", id: "matriculation" },
  { label: "Intermediate", id: "intermediate" },
  { label: "Graduation", id: "graduation" },
  { label: "Masters", id: "masters" },
];

const experinceOptions = [
  { label: "All", id: "all" },
  { label: "yes", id: "yes" },
  { label: "no", id: "no" },
];

const appyForOptions = [
  { label: "All", id: "all" },
  { label: "Permanent", id: "permanent" },
  { label: "Internship", id: "internship" },
];

const TalentAquisition = () => {
  const [rangeCommited, setRangeCommited] = useState(false);
  const [qualificationValue, setQualificationValue] = useState(
    qualificationOptions[0]
  );
  const [experinceValue, setExperinceValue] = useState(experinceOptions[0]);
  const [applyValue, setApplyValue] = useState(appyForOptions[0]);
  const [skillsValue, setSkillsValue] = useState([{ label: "All", id: "all" }]);
  const [skillsOptions, setSkillsOptions] = useState([]);
  const [rows, setRows] = useState();
  const [loading, setLoading] = useState(false);
  const [maxSalary, setMaxSalary] = useState();
  const [rangeValue, setRangeValue] = useState([0, 1000000]);

  const handleQualification = (event, newValue) => {
    if (!newValue) {
      return setQualificationValue(qualificationOptions[0]);
    }
    setQualificationValue(newValue);
  };

  const handleExperince = (event, newValue) => {
    if (!newValue) {
      return setExperinceValue(experinceOptions[0]);
    }
    setExperinceValue(newValue);
  };

  const handleApply = (event, newValue) => {
    if (!newValue) {
      return setApplyValue(appyForOptions[0]);
    }
    setApplyValue(newValue);
  };

  const handleSkills = (event, newValue) => {
    const hasAllOption = newValue.some((skill) => skill.id === "all");
    if (!hasAllOption && newValue.length === 0) {
      return setSkillsValue([skillsOptions[0]]);
    }
    if (hasAllOption && newValue.length > 1) {
      return setSkillsValue(newValue.filter((skill) => skill.id !== "all"));
    }

    setSkillsValue(newValue);
  };

  const handleSliderChange = (event, newValue, activeThumb) => {
    const distance = 10000;
    if (activeThumb === 0) {
      setRangeValue([
        Math.min(newValue[0], rangeValue[1] - distance),
        rangeValue[1],
      ]);
    } else {
      setRangeValue([
        rangeValue[0],
        Math.max(newValue[1], rangeValue[0] + distance),
      ]);
    }
  };

  const handleSliderChangeCommitted = () => {
    setRangeCommited(!rangeCommited);
  };

  // Dynamically getting tags & Highest Salary
  const fetch_Tags_HighestSalary = async () => {
    try {
      const res = await axios.get("/api/interview");
      const result = res.data;
      const fetchedSkills = result.map((item) => item.expertiseAndSkills);
      const expectedSalaryList = result.map((item) => item.expectedSalary);
      const highestExpectedSalary = Math.max(...expectedSalaryList);
      setMaxSalary(highestExpectedSalary);

      const splitSkills = fetchedSkills
        .map((skill) => skill.split(",").map((item) => item.trim()))
        .flat();

      const uniqueSkillsList = ["all", ...new Set(splitSkills)];

      const uniqueSkills = uniqueSkillsList.map((item) => {
        return {
          label: WordCaptitalize(item),
          id: item,
        };
      });
      setSkillsOptions(uniqueSkills);
    } catch (error) {
      CheckAxiosError(error);
    }
  };

  // Filter Values Submit Function
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const query = {
        qualification: qualificationValue.id,
        workExp: experinceValue.id,
        applyFor: applyValue.id,
        skills: skillsValue.map((item) => {
          return item.id;
        }),
        minSalary: rangeValue[0],
        maxSalary: rangeValue[1],
      };
      const queryString = new URLSearchParams(query).toString();

      const response = await axios.post(`/api/interview/search?${queryString}`);
      setRows(
        response.data.map((item) => {
          return { ...item, id: item._id };
        })
      );

      setLoading(false);
    } catch (error) {
      setLoading(false);
      CheckAxiosError(error);
    }
  };

  // For Submitting filter values
  useEffect(() => {
    handleSubmit();
  }, [
    qualificationValue,
    experinceValue,
    applyValue,
    rangeCommited,
    skillsValue,
  ]);

  // for fetching tags & highest salary
  useEffect(() => {
    fetch_Tags_HighestSalary();
  }, []);

  // for setting max sallary to default value of slider
  useEffect(() => {
    setRangeValue([0, maxSalary]);
  }, [maxSalary]);

  return (
    <Box
      sx={{
        marginTop: "16px",
        padding: "20px",
        margin: "20px",
        border: "1px solid #e8ebee",
        borderRadius: "5px",
        backgroundColor: "white",
      }}
    >
      {/* {loading && <CustomOverlay open />} */}

      <Grid container spacing={"20px"} marginBottom={5}>
        <Grid item xs={2.4}>
          <Autocomplete
            disablePortal
            options={qualificationOptions}
            popupIcon={<KeyboardArrowDown />}
            slotProps={slotProps}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={qualificationValue}
            onChange={handleQualification}
            renderInput={(params) => (
              <CustomTextField
                {...params}
                label="Qualification"
                variant="filled"
              />
            )}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Autocomplete
            disablePortal
            options={experinceOptions}
            popupIcon={<KeyboardArrowDown />}
            slotProps={slotProps}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={experinceValue}
            onChange={handleExperince}
            renderInput={(params) => (
              <CustomTextField {...params} label="Experince" variant="filled" />
            )}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Autocomplete
            disablePortal
            options={appyForOptions}
            popupIcon={<KeyboardArrowDown />}
            slotProps={slotProps}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={applyValue}
            onChange={handleApply}
            renderInput={(params) => (
              <CustomTextField {...params} label="Apply For" variant="filled" />
            )}
          />
        </Grid>

        <Grid item xs={2.4}>
          <Autocomplete
            multiple
            limitTags={1}
            disablePortal
            options={skillsOptions}
            popupIcon={<KeyboardArrowDown />}
            slotProps={slotProps}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={skillsValue}
            onChange={handleSkills}
            renderInput={(params) => (
              <CustomTextField {...params} label="Skills" variant="filled" />
            )}
          />
        </Grid>
        <Grid item xs={2.4}>
          <Box>
            <Typography>
              <strong>Salary:</strong> Rs: {rangeValue[0]} - Rs: {rangeValue[1]}
            </Typography>

            <Slider
              value={rangeValue}
              onChange={handleSliderChange}
              onChangeCommitted={handleSliderChangeCommitted}
              valueLabelDisplay="auto"
              getAriaLabel={() => "Temperature range"}
              min={0}
              max={maxSalary}
              step={1000}
              disableSwap
            />
          </Box>
        </Grid>
      </Grid>

      {/* =============================== DATAGRID===================================== */}

      <DataGridTable rows1={rows} />
    </Box>
  );
};

const CustomTextField = styled(TextField)(() => ({
  "& .MuiFilledInput-root": {
    backgroundColor: customColors.defaultAlpha,
    borderRadius: "10px",
  },
  "& .MuiFilledInput-underline::before, & .MuiFilledInput-underline::after": {
    borderBottom: "none",
  },

  "& .MuiFilledInput-underline:hover:not(.Mui-disabled, .Mui-error):before ": {
    borderBottom: "none",
  },
}));

const slotProps = {
  paper: {
    sx: {
      backgroundColor: customColors.defaultAlpha,
      boxShadow:
        "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
      borderRadius: "10px",
    },
  },
};

const DataGridTable = ({ rows1 = [] }) => {
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
    },
    {
      field: "CNIC",
      headerName: "CNIC",
      width: 200,
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "contact",
      headerName: "Contact",
      width: 200,
    },
    {
      field: "appliedOn",
      headerName: "Applied On",
      width: 200,
      valueFormatter: (params) => {
        return shortDateWithMonthName(params.value);
      },
    },
    {
      field: "workExp",
      headerName: "Work Exp",
      width: 200,
      renderCell: (params) => {
        return (
          <CustomChip
            label={WordCaptitalize(params.value)}
            status={params.value}
          />
        );
      },
    },
    {
      field: "expectedSalary",
      headerName: "Salary (PKR)",
      width: 200,
      valueFormatter: (params) => {
        return salaryformatter(params.value);
      },
    },
    {
      field: "qualification",
      headerName: "Qualification",
      width: 200,
      renderCell: (params) => {
        return (
          <CustomChip
            label={WordCaptitalize(params.value)}
            status={params.value}
          />
        );
      },
    },
    {
      field: "applyFor",
      headerName: "Apply For",
      width: 200,
      renderCell: (params) => {
        return (
          <CustomChip
            label={WordCaptitalize(params.value)}
            status={params.value}
          />
        );
      },
    },
    {
      field: "response",
      headerName: "Response",
      width: 200,
      renderCell: (params) => {
        return (
          <CustomChip
            label={WordCaptitalize(params.value)}
            icon={<RadioButtonChecked />}
            status={params.value}
          />
        );
      },
    },
    {
      field: "expertiseAndSkills",
      headerName: "Skills",
      width: 200,
    },
  ];
  return (
    <>
      <DataGrid columns={columns} rows={rows1} />
    </>
  );
};

DataGridTable.propTypes = {
  rows1: PropTypes.any,
};

export default TalentAquisition;
