import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export default function InterneeFinance() {
  const InterneeStipends = [
    {
      field: "id",
      headerName: "Internee ID",
      width: 200,
    },
    {
      field: "InterneeName",
      headerName: "Employee Name",
      width: 200,
    },
    {
      field: "interneeof",
      headerName: "Internee of",
      width: 200,
    },
    {
      field: "stipend",
      headerName: "Stipend",
      width: 200,
    },
  ];

  const rows = [
    {
      id: 1,
      InterneeName: "Jon",
      interneeof: "VBT",
      stipend: "20000",
    },
    {
      id: 2,
      InterneeName: "Jon",
      interneeof: "Pasha",
      stipend: "20000",
    },
    {
      id: 3,
      InterneeName: "Jon",
      interneeof: "PSEB",
      stipend: "20000",
    },
  ];

  return (
    <Box sx={{ height: 550 }}>
      <DataGrid
        rows={rows}
        columns={InterneeStipends}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}