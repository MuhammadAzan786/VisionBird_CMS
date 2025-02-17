import { DataGrid, GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import { Avatar, Box, chipClasses, Stack, Typography } from "@mui/material";
import axios from "../../../../utils/axiosInterceptor";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Cancel, CheckCircle, Circle, Pending } from "@mui/icons-material";
import { WordCaptitalize } from "../../../../utils/common";
import { CustomChip } from "../../../../components/Styled/CustomChip";
import EmployeeNameCell from "../../../../components/Grid Cells/EmployeeProfileCell";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import CustomOverlay from "../../../../components/Styled/CustomOverlay";
const status = ["pending", "approved", "rejected"];
const colStyle = {
  headerAlign: "center",
  align: "center",
};

const AdminLoanTable = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const columns = [
    {
      field: "employee_name",
      headerName: "Employee",
      width: 150,
      renderCell: ({ row }) => (
        <EmployeeNameCell userId={row.employee_id} name={row.employee_name} src={row.employee_img?.secure_url} />
      ),
    },
    {
      field: "loan_reason",
      headerName: "Reason",
      width: 300,
    },
    {
      field: "current_salary",
      headerName: "Current Salary",
      width: 150,
      ...colStyle,
    },
    {
      field: "loan_amount",
      headerName: "Loan Amount",
      width: 150,
      ...colStyle,
      cellClassName: "text-red-500 font-medium",
    },

    {
      field: "loan_payback_type",
      headerName: "Loan Payback",
      ...colStyle,
      width: 150,
      cellClassName: "font-medium",
      renderCell: (params) => {
        return (
          <>
            {params.value === "full" ? (
              <CustomChip label={params.value} />
            ) : (
              <CustomChip label={`${params.value} (${params.row.installment_duration_months})`} />
            )}
          </>
        );
      },
    },

    {
      field: "request_date",
      headerName: "Request Date",
      ...colStyle,
      width: 150,
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
            label={params.value}
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
        // const label =
        // params.value.charAt(0).toUpperCase() + params.value.slice(1);
        return <CustomChip label={params.value} status={params.value} icon={icon} />;
      },
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
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
              size="medium"
              label="Cancel"
              onClick={handleCancelClick(id)}
              sx={iconStyles.cancel}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            key={1}
            icon={<EditIcon />}
            size="medium"
            label="Edit"
            onClick={handleEditClick(id)}
            sx={iconStyles.edit}
            disabled={row.approval_status === "rejected" || row.approval_status === "approved"}
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
    const { id, approval_status, activity_status } = newRow;

    if (approval_status === "pending") {
      return { ...newRow, isNew: false };
    }

    try {
      const res = await axios.post(`/api/advance_payments/admin/advance-applications/?type=loan`, {
        currentUser,
        _id: id,
        approval_status,
        activity_status,
      });

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

  const {
    data: fetchAllRequests = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["ali"],
    queryFn: async () => {
      if (!currentUser) return [];
      const result = await axios.post("/api/advance_payments/admin/loan/list", {
        currentUser,
      });
      console.log("resultttttttttt", result.data);
      return result.data || [];
    },
    enabled: !!currentUser,
    // staleTime: 1000,
    // refetchInterval:5000
  });
  if (isLoading) {
    return <CustomOverlay open={true} />;
  }
  if (error) {
    toast.error(error.message);
  }
  if (fetchAllRequests && fetchAllRequests.length > 0 && rows.length === 0) {
    const newData = fetchAllRequests.map((item) => ({
      ...item,
      id: item._id,
      employee_name: item?.employee_obj_id?.employeeName,
      employee_img: item?.employee_obj_id?.employeeProImage,
      employee_id: item?.employee_obj_id?.employeeID,
      current_salary: item?.employee_obj_id?.BasicPayAfterProbationPeriod,
      request_date: dayjs(item.createdAt).format("DD MMM, YYYY"),
    }));
    setRows(newData); // Only set rows if they haven't been set already
  }

  return (
    <DataGrid
      rows={rows ?? []}
      columns={columns}
      editMode="row"
      rowModesModel={rowModesModel} // for checking which row is in edit mode
      onRowModesModelChange={handleRowModesModelChange}
      processRowUpdate={processRowUpdate}
      onProcessRowUpdateError={handleRowUpdateError}
    />
  );
};

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

export default AdminLoanTable;
