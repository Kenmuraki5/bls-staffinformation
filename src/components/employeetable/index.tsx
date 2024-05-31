'use client'
import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef, GridToolbar, GridRowParams } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';

const columns: GridColDef[] = [
  { field: 'empId', headerName: 'StaffID', minWidth: 100, maxWidth: 200, flex: 1, },
  { field: 'thFirstName', headerName: 'Thai name', minWidth: 100, maxWidth: 200, flex: 1 },
  { field: 'enFirstName', headerName: 'eng name', minWidth: 100, maxWidth: 200, flex: 1 },
  { field: 'email', headerName: 'Email', minWidth: 100, maxWidth: 200, flex: 1 },
  { field: 'organizationUnit', headerName: 'Department', minWidth: 100, maxWidth: 200, flex: 1 },
  { field: 'corporationTitle', headerName: 'CorporationTitle', minWidth: 100, maxWidth: 200, flex: 1 },
  { field: 'branchId', headerName: 'Branch', minWidth: 100, maxWidth: 80, flex: 1 },
  { field: 'extensionCode', headerName: 'ExtensionCode', minWidth: 100, maxWidth: 120, flex: 1 },
  { field: 'managerId', headerName: 'managerID', minWidth: 100, maxWidth: 120, flex: 1  },
];

type PropsType = {
  dataEmployees: any;
};

const EmployeeTable: React.FC<PropsType> = ({ dataEmployees }) => {
  const router = useRouter();  // Use useRouter
  const data = dataEmployees?.map((employee: any, index: any) => ({
    id: index + 1,
    ...employee,
  }));

  const handleRowClick = (params: GridRowParams) => {
    const { empId } = params.row;
    router.push(`StaffInformation/${empId}`);  // Navigate to the employee detail page
  };

  return (
    <div style={{ width: '100%' }}>
      <div className='bg-rose-700 rounded my-5'>
        <p className='text-white font-bold rounded px-5'>Staff Information</p>
      </div>
      <DataGrid
        autoHeight
        rows={data || []}
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        onRowClick={handleRowClick}
      />
    </div>
  );
};

export default EmployeeTable;
