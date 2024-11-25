import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { Avatar, Box, chipClasses, Stack, Typography } from "@mui/material";
import axios from "../../../../utils/axiosInterceptor";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { Cancel, CheckCircle, Circle, Pending } from "@mui/icons-material";
import PropTypes from "prop-types";
import { WordCaptitalize } from "../../../../utils/common";
import { CustomDataGrid } from "../styled/CustomDataGrid";
import { GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import { CustomChip } from "../../../../components/Styled/CustomChip";
import EmployeeNameCell from "../../../../components/Grid Cells/EmployeeProfileCell";

const status = ["pending", "approved", "rejected"];
const colStyle = {
  headerAlign: "center",
  align: "center",
};

const AdminSalaryTable = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const fetchAllRequests = async () => {
    try {
      const result = await axios.post(
        "/api/advance_payments/admin/advance/salary/list",
        {
          currentUser,
        }
      );

      return result.data;
    } catch (error) {
      toast.error("there is an error retreiving all data");
    }
  };
  useEffect(() => {
    fetchAllRequests().then((response) => {
      const newData = response.map((item) => {
        return {
          ...item,
          id: item._id,
          employee_name: item.employee_obj_id.employeeName,
          employee_img: item.employee_obj_id.employeeProImage,
          employee_id: item.employee_obj_id.employeeID,
          current_salary: item.employee_obj_id.BasicPayAfterProbationPeriod,
          request_date: dayjs(item.createdAt).format("DD MMM, YYYY"),
        };
      });

      setRows(newData);
    });
  }, []);

  const columns = [
    {
      field: "employee_name",
      headerName: "Employee",
      width: 150,
      renderCell: ({ row }) => (
        <EmployeeNameCell
          userId={row.employee_id}
          name={row.employee_name}
          src={row.employee_img}
        />
      ),
    },
    {
      field: "advance_salary_reason",
      headerName: "Reason",
      width: 300,
    },
    {
      field: "current_salary",
      headerName: "Current Sallary",
      width: 150,
      ...colStyle,
    },
    {
      field: "advance_salary_months",
      headerName: "Advance Sallary",
      width: 150,
      cellClassName: "font-medium text-red-600",
      ...colStyle,
      renderCell: (params) => monthCell(params),
    },

    {
      field: "request_date",
      headerName: "Request Date",
      width: 150,
      ...colStyle,
    },
    {
      field: "activity_status",
      headerName: "Activity Status",
      width: 150,
      ...colStyle,
      renderCell: (params) => {
        if (params.value === null) {
          return " -";
        }

        return (
          <CustomChip
            label={WordCaptitalize(params.value)}
            status={params.value}
            icon={<Circle />}
            sx={{
              [`& .${chipClasses.icon}`]: {
                fontSize: "10px",
                marginLeft: "10px",
              },
            }}
          />
        );
      },
    },
    {
      field: "approval_status",
      headerName: "Approval Status",
      width: 150,
      ...colStyle,
      editable: true,
      type: "singleSelect",
      valueOptions: status,
      renderCell: (params) => {
        let icon;
        if (params.value === "pending") {
          icon = <Pending />;
        } else if (params.value === "rejected") {
          icon = <Cancel />;
        } else if (params.value === "approved") {
          icon = <CheckCircle />;
        }
        const label =
          params.value.charAt(0).toUpperCase() + params.value.slice(1);
        return <CustomChip label={label} status={params.value} icon={icon} />;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      ...colStyle,
      cellClassName: "actions",
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={1}
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              size="medium"
              sx={iconStyles.save}
            />,
            <GridActionsCellItem
              key={2}
              icon={<CancelIcon />}
              label="Cancel"
              onClick={handleCancelClick(id)}
              color="inherit"
              size="medium"
              sx={iconStyles.cancel}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={1}
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(id)}
            size="medium"
            sx={iconStyles.edit}
            disabled={
              row.approval_status === "rejected" ||
              row.approval_status === "approved"
            }
          />,
        ];
      },
    },
  ];

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const processRowUpdate = async (newRow) => {
    const { id, approval_status, activity_status, employee_obj_id } = newRow;
    if (approval_status === "pending") {
      return { ...newRow, isNew: false };
    }
    try {
      const res = await axios.post(
        `/api/advance_payments/admin/advance-applications/?type=advanceSalary`,
        {
          currentUser,
          _id: id,
          approval_status,
          activity_status,
          employee_obj_id,
        }
      );

      const newObj = { ...res.data, id: res.data._id };
      toast.success("Loan status updated successfully!");
      return { ...newObj, isNew: false };
    } catch (error) {
      toast.error("Error updating Loan status.");
      console.error("Error updating loan status:", error);
      return { ...newRow, isNew: true };
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleRowUpdateError = (error) => {
    console.error("Error during row update:", error);
    toast.error("An error occurred while updating the row.");
  };

  return (
    <CustomDataGrid
      rows={rows}
      columns={columns}
      editMode="row"
      rowModesModel={rowModesModel} // for checking which row is in edit mode
      onRowModesModelChange={handleRowModesModelChange}
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={handleRowUpdateError}
      disableColumnMenu
      disableColumnSorting
      rowHeight={80}
      columnHeaderHeight={45}
    />
  );
};

const monthCell = (params) => (
  <>{params.value > 1 ? `${params.value} Months` : `${params.value} Month`}</>
);

const iconStyles = {
  edit: {
    color: "#6A5ACD",
    backgroundColor: "#EFE6FF",
  },
  cancel: {
    color: "#D32F2F",
    backgroundColor: "#FDECEA",
  },
  save: {
    color: "#2E8B57",
    backgroundColor: "#E6FAF1",
  },
};
export default AdminSalaryTable;
