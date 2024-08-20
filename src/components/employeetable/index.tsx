'use client'
import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, styled, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';

type PropsType = {
  dataEmployees: any;
};

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .no-rows-primary': {
    fill: theme.palette.mode === 'light' ? '#AEB8C2' : '#3D4751',
  },
  '& .no-rows-secondary': {
    fill: theme.palette.mode === 'light' ? '#E8EAED' : '#1D2126',
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={96}
        viewBox="0 0 452 257"
        aria-hidden
        focusable="false"
        className='pt-3'
      >
        <path
          className="no-rows-primary"
          d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
        />
        <path
          className="no-rows-primary"
          d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
        />
        <path
          className="no-rows-secondary"
          d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
        />
      </svg>
      <Box sx={{ mt: 2 }}>No data Found</Box>
    </StyledGridOverlay>
  );
}

const EmployeeTable: React.FC<PropsType> = ({ dataEmployees }) => {
  const [alignment, setAlignment] = React.useState('managers');
  const router = useRouter();
  const params = useParams();

  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'empId',
      headerName: 'Staff ID',
      minWidth: 70,
      maxWidth: 70,
      flex: 1,
      renderCell: (data) => (
        <a
          href={`/bualuang/${params.domain}/StaffInformation/${data.row.empId}`}
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {data.value}
        </a>
      ),
      headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center'
    },
    { field: 'thFirstName', headerName: 'Thai Name', minWidth: 100, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'enFirstName', headerName: 'English Name', minWidth: 100, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'email', headerName: 'Email', minWidth: 100, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'organizationUnit', headerName: 'Department', minWidth: 100, maxWidth: 450, flex: 1,
      renderCell: (params) => (
        <a
          href={`/StaffInformation/${params.row.empId}`}
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={(e) => {
            e.preventDefault();
            router.push(`?organizationId=${params.row.organizationId}`);
          }}
        >
          {params.value}
        </a>
      ),
      headerClassName: 'super-app-theme--header', headerAlign: 'center'
     },
    { field: 'corporationTitle', headerName: 'CorporationTitle', minWidth: 140, maxWidth: 140, flex: 1,
      renderCell: (params) => params.row.corporationTitle != "" ? <div>{abbreviateTitle(params.row.corporationTitle)}</div> : "",
      headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center' },
    { field: 'branchId', headerName: 'Branch', minWidth: 70, maxWidth: 70, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center' },
    { field: 'extensionCode', headerName: 'Ext', minWidth: 70, maxWidth: 70, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center', align: 'center' },
  ];

  function abbreviateTitle(title: string) {
    const primaryTitle = title.split(" / ")[0];
    const words = primaryTitle.split(" ");
    const abbreviation = words.map(word => word[0]).join("");
    return abbreviation;
  }

  const filteredEmployees = alignment === 'all' ? dataEmployees : dataEmployees.filter((employee: any) => employee.managerId !== "");

  return (
    <div style={{ width: '100%' }}>
      <div className='bg-rose-700 rounded my-5'>
        <p className='text-white font-bold rounded px-5'>STAFF INFORMATION</p>
      </div>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Employee Filter"
        className='mb-3'
      >
        <ToggleButton value="managers">Show Only Managers</ToggleButton>
        <ToggleButton value="all">Show All Employees</ToggleButton>
      </ToggleButtonGroup>
      <DataGrid
        sx={{
          '.MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold !important',
          },
          height: '60vh'
        }}
        getRowId={(row) => row.empId}
        rows={filteredEmployees || []}
        columns={columns}
        showCellVerticalBorder
        showColumnVerticalBorder
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
        }}
      />
    </div>
  );
};

export default EmployeeTable;
