'use client'
import * as React from 'react';
import { DataGrid, GridColDef, GridToolbar, GridRowParams } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';

type PropsType = {
  dataEmployees: any;
};

const EmployeeTable: React.FC<PropsType> = ({ dataEmployees }) => {
  const router = useRouter();
  const columns: GridColDef[] = [
    {
      field: 'empId',
      headerName: 'StaffID',
      minWidth: 100,
      maxWidth: 80,
      flex: 1,
      renderCell: (params) => (
        <a
          href={`/StaffInformation/${params.row.empId}`}
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={(e) => {
            e.preventDefault(); // Prevents the default link behavior
            router.push(`/StaffInformation/${params.row.empId}`);
          }}
        >
          {params.value}
        </a>
      ),
      headerClassName: 'super-app-theme--header', headerAlign: 'center'
    },
    { field: 'thFirstName', headerName: 'Thai name', minWidth: 100, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'enFirstName', headerName: 'eng name', minWidth: 100, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'email', headerName: 'Email', minWidth: 100, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'organizationUnit', headerName: 'Department', minWidth: 100, flex: 1,
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
    { field: 'corporationTitle', headerName: 'CorporationTitle', minWidth: 100, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'branchId', headerName: 'Branch', minWidth: 100, maxWidth: 80, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'extensionCode', headerName: 'ExtensionCode', minWidth: 100, maxWidth: 120, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
    { field: 'managerId', headerName: 'managerID', minWidth: 100, maxWidth: 120, flex: 1, headerClassName: 'super-app-theme--header', headerAlign: 'center' },
  ];

  return (
    <div style={{ width: '100%' }}>
      <div className='bg-rose-700 rounded my-5'>
        <p className='text-white font-bold rounded px-5'>Staff Information</p>
      </div>
      <DataGrid
        sx={{
        '.MuiDataGrid-columnHeaderTitle': {
          fontWeight: 'bold !important',
          color: 'white',
        },
        '.super-app-theme--header': {
          backgroundColor: 'rgb(225 29 72)',
        },
        }}
        autoHeight
        getRowId={(row) => row.empId}
        rows={dataEmployees || []}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        showCellVerticalBorder
        showColumnVerticalBorder
      />
    </div>
  );
};

export default EmployeeTable;
