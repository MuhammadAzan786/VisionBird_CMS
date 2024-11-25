import { Cancel, CheckCircle, Circle, Pending } from "@mui/icons-material";
import { chipClasses } from "@mui/material";
import axios from "../../../../utils/axiosInterceptor";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { WordCaptitalize } from "../../../../utils/common";
import { CustomDataGrid } from "../styled/CustomDataGrid";
import { CustomChip } from "../../../../components/Styled/CustomChip";

const colStyle = {
  headerAlign: "center",
  align: "center",
};

const UserAdvanceTable = () => {
  console.log("rendered user sallary");
  const { currentUser } = useSelector((state) => state.user);
  const [rows, setRows] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await axios.post(
        "/api/advance_payments/user/advance-applications/?type=salary",
        {
          currentUser,
        }
      );
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApplications().then((res) => {
      const advance_applications = res.map((item) => {
        return {
          ...item,
          id: item._id,
          request_date: dayjs(item.createdAt).format("DD MMM, YYYY"),
        };
      });
      setRows(advance_applications);
    });
  }, []);

  const columns = [
    {
      field: "advance_salary_reason",
      headerName: "Reason",
      width: 250,
    },
    {
      field: "advance_salary_months",
      headerName: "Advance Needed",
      width: 180,
      ...colStyle,
      renderCell: (params) => monthCell(params),
    },
    {
      field: "advance_salary_left",
      headerName: "Advance Left",
      width: 180,
      ...colStyle,
      cellClassName: "text-red-500 font-medium",
      renderCell: (params) => (
        <>
          {params.value > 1
            ? `${params.value} Months`
            : `${params.value} Month`}
        </>
      ),
    },
    {
      field: "request_date",
      headerName: "Request Date",
      width: 180,
      ...colStyle,
    },

    {
      field: "activity_status",
      headerName: "Activity Status",
      width: 180,
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
      width: 180,
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
  ];
  return (
    <CustomDataGrid
      rows={rows}
      columns={columns}
      rowHeight={80}
      columnHeaderHeight={45}
      disableColumnMenu
      disableColumnSorting
    />
  );
};

const monthCell = (params) => (
  <>{params.value > 1 ? `${params.value} Months` : `${params.value} Month`}</>
);

export default UserAdvanceTable;
