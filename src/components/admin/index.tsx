'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import {
  GridRowModesModel,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridEventListener,
  GridRowId,
  GridRowEditStopReasons,
  GridSlots,
} from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import { getRole, getToken } from '@/app/utils/auth';
import { AdminEmployeemanagementProps } from './type';
import EmployeeModal from '../addModal/addEmployee';
import OrganizationModal from '../addModal/addOrganization';
import DomainModal from '../addModal/addDomain';
import JobModal from '../addModal/addJob';
import BranchModal from '../addModal/addBranch';
import ManagerModal from '../addModal/addManager';
import AlertResponse from '../snackbar';

interface EditToolbarProps {
  type: string
  role: any
  handleOpenAddModal: (setOpenAddModal: string, row: any) => void
}

function EditToolbar(props: EditToolbarProps) {
  const { handleOpenAddModal, role, type } = props;

  const handleClick = () => {
    handleOpenAddModal(type, null); // Pass null to clear the selectedRow state
  };

  return (
    <GridToolbarContainer>
      {role === "AdminStaffInformation" && (
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      )}
    </GridToolbarContainer>
  );
}


export const StartEditButtonGrid: React.FC<AdminEmployeemanagementProps & { type: "employees" | "organizations" | 'domains' | 'branchs' | "managers" | "jobs" }> = ({ data, type }) => {
  const params = useParams()
  const [rows, setRows] = React.useState<any>(data);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [errorResponse, setError] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [role, setRole] = React.useState<any>(null);


  const [openEmployeeModal, setOpenEmployeeModal] = React.useState(false);
  const [openOrganizationModal, setOpenOrganizationModal] = React.useState(false);
  const [openDomainModal, setOpenDomainModal] = React.useState(false);
  const [openManagerModal, setOpenManagerModal] = React.useState(false);
  const [openBranchModal, setOpenBranchModal] = React.useState(false);
  const [openJobModal, setOpenJobModal] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const handleOpenAddModal = (type: string, row: any) => {
    setSelectedRow(row || null);
    if (type == "employees") {
      setOpenEmployeeModal(true)
    }
    if (type == "organizations") {
      setOpenOrganizationModal(true)
    }
    if (type == "domains") {
      setOpenDomainModal(true)
    }
    if (type == "branchs") {
      setOpenBranchModal(true)
    }
    if (type == "managers") {
      setOpenManagerModal(true)
    }
    if (type == "jobs") {
      setOpenJobModal(true)
    }

  };
  const handleCloseAddModal = () => {
    if (type == "employees") {
      setOpenEmployeeModal(false)
    }
    if (type == "organizations") {
      setOpenOrganizationModal(false)
    }
    if (type == "domains") {
      setOpenDomainModal(false)
    }
    if (type == "branchs") {
      setOpenBranchModal(false)
    }
    if (type == "managers") {
      setOpenManagerModal(false)
    }
    if (type == "jobs") {
      setOpenJobModal(false)
    }
    setSelectedRow(null)
  };

  React.useEffect(() => {
    async function fetchRole() {
      try {
        const roleData = await getRole();
        setRole(roleData);
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    }

    fetchRole();
  }, []);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    const isConfirmed = window.confirm('Are you sure you want to delete this record?');
  
    if (!isConfirmed) {
      return;
    }
  
    try {
      await deleteRecord(id);
      setRows(rows.filter((row: any) => {
        switch (type) {
          case "employees":
            return row.empId !== id;
          case "organizations":
            return row.organizationId !== id;
          case 'domains':
            return row.domainId !== id;
          case 'branchs':
            return row.branchId !== id;
          case 'managers':
            return row.managerId !== id;
          case 'jobs':
            return row.jobId !== id;
          default:
            return true;
        }
      }));
      setSnackbarOpen(true);
      setError(false);
      setAlertMessage('Successfully Deleted');
      handleCloseAddModal();
    } catch (error: any) {
      setSnackbarOpen(true);
      setError(true);
      setAlertMessage(error.message);
    }
  };

  async function deleteRecord(id: string | number) {
    try {
      const token = await getToken("auth_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/${params.manage}/${id}`, {
        method: "DELETE",
        headers: {
          "authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
      });
      const responseData = await res.json();
      if (!res.ok) {
        const errorMessage = responseData.message || `Failed to delete ${params.manage}`;
        throw new Error(errorMessage);
      }
      return responseData;
    } catch (error: any) {
      throw new Error(error.message || error);
    }
  }

  async function updateRecord(data: any) {
    try {
      const token = await getToken("auth_token");
      const payloadData = { ...data };
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/${params.manage}`, {
        method: "PUT",
        headers: {
          "authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadData)
      });

      const responseData = await res.json();
      if (!res.ok) {
        const errorMessage = responseData.message || `Failed to update: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      setSnackbarOpen(true);
      setError(false);
      setAlertMessage('Successfully Updated');
      return responseData;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async function addRecord(data: any) {
    try {
      const token = await getToken("auth_token");
      const payloadData = { ...data };
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/${params.manage}`, {
        method: "POST",
        headers: {
          "authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadData)
      });

      const responseData = await res.json();
      if (!res.ok) {
        const errorMessage = responseData.message || `Failed to update: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      setSnackbarOpen(true);
      setError(false);
      setAlertMessage('Successfully Updated');
      if (params.manage == "manager"){
        setRows((oldRows: any) => [
          ...oldRows,
          {...data, managerId : responseData.managerId}
        ])
        return responseData
      }
      setRows((oldRows: any) => [
        ...oldRows,
        responseData
      ])
      return responseData;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };


  const getRowId = (row: any): GridRowId => {
    switch (type) {
      case "employees":
        return row.empId;
      case "organizations":
        return row.organizationId;
      case 'domains':
        return row.domainId;
      case 'branchs':
        return row.branchId;
      case 'managers':
        return row.managerId;
      case 'jobs':
        return row.jobId;
      default:
        return '';
    }
  };

  const columns_emp: GridColDef[] = [
    {
      field: 'empId', headerName: 'Staff ID', minWidth: 100, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', editable: false, hideable: true,
      renderCell: (params) => (
        <div
          onClick={() => handleOpenAddModal(type, params.row)}
          className='text-center text-blue-500 cursor-pointer flex items-center justify-center h-full hover:underline'
        >
          {params.value}
        </div>
      ),
    },
    { field: 'thTitle', headerName: 'Thai Title', minWidth: 100, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'thFirstName', headerName: 'Thai name', minWidth: 100, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'thLastName', headerName: 'Thai Last name', minWidth: 120, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'enTitle', headerName: 'English Title', minWidth: 100, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'enFirstName', headerName: 'English Name', minWidth: 140, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'enLastName', headerName: 'English LastName', minWidth: 140, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'nickname', headerName: 'Nick Name', minWidth: 100, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'email', headerName: 'Email', minWidth: 200, maxWidth: 300, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'organizationId', headerName: 'Department', minWidth: 100, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'corporationTitle', headerName: 'CorporationTitle', minWidth: 200, maxWidth: 400, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'branchId', headerName: 'Branch ID', minWidth: 100, maxWidth: 80, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'jobId', headerName: 'job ID', minWidth: 100, maxWidth: 80, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'extensionCode', headerName: 'ExtensionCode', minWidth: 120, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'directLine', headerName: 'directLine', minWidth: 120, maxWidth: 400, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'derivativeTrader', headerName: 'DerivativeTrader', minWidth: 120, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'derivativeLicense', headerName: 'DerivativeLicense', minWidth: 140, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'singleTrader', headerName: 'SingleTrader', minWidth: 100, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'singleLicense', headerName: 'SingleLicense', minWidth: 100, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'otherLicense', headerName: 'OtherLicense', minWidth: 140, maxWidth: 160, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'startWorkingDate', headerName: 'StartWorkingDate', minWidth: 140, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'lastWorkingDate', headerName: 'LastWorkingDate', minWidth: 140, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
    { field: 'effectiveDate', headerName: 'EffectiveDate', minWidth: 140, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center', },
  ];

  const columns_org: GridColDef[] = [
    {
      field: 'organizationId', headerName: 'Organization ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center',
      renderCell: (params) => (
        <div
          onClick={() => handleOpenAddModal(type, params.row)}
          className='text-center text-blue-500 cursor-pointer flex items-center justify-center h-full hover:underline'
        >
          {params.value}
        </div>
      ),
    },
    { field: 'domainId', headerName: 'Domain ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center' },
    { field: 'organizationUnit', headerName: 'Organization Unit', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header' },
    { field: 'parentOrganizationId', headerName: 'Parent Organization ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center' },
  ];

  const columns_domain: GridColDef[] = [
    {
      field: 'domainId',
      headerName: 'Domain ID',
      minWidth: 100,
      flex: 1,
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header', align: 'center',
      renderCell: (params) => (
        <div
          onClick={() => handleOpenAddModal(type, params.row)}
          className='text-center text-blue-500 cursor-pointer flex items-center justify-center h-full hover:underline'
        >
          {params.value}
        </div>
      ),
    },
    {
      field: 'domainName',
      headerName: 'Domain Name',
      minWidth: 100,
      flex: 1,
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header', align: 'center',
    },
  ];

  const columns_branch: GridColDef[] = [
    {
      field: 'branchId', headerName: 'Branch ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center',
      renderCell: (params) => (
        <div
          onClick={() => handleOpenAddModal(type, params.row)}
          className='text-center text-blue-500 cursor-pointer flex items-center justify-center h-full hover:underline'
        >
          {params.value}
        </div>
      ),
    },
    { field: 'branchName', headerName: 'Branch Name', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center' },
    { field: 'location', headerName: 'location', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header' },
    { field: 'contact', headerName: 'Contact', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header' },
  ]

  const columns_job: GridColDef[] = [
    {
      field: 'jobId', headerName: 'Job ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center',
      renderCell: (params) => (
        <div
          onClick={() => handleOpenAddModal(type, params.row)}
          className='text-center text-blue-500 cursor-pointer flex items-center justify-center h-full hover:underline'
        >
          {params.value}
        </div>
      )
    },
    { field: 'jobTitle', headerName: 'Job Title', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center' },
  ]

  const columns_manager: GridColDef[] = [
    { field: 'empId', headerName: 'Staff ID', minWidth: 150, maxWidth:150, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center',
      renderCell: (params) => (
        <div
          onClick={() => handleOpenAddModal(type, params.row)}
          className='text-center text-blue-500 cursor-pointer flex items-center justify-center h-full hover:underline'
        >
          {params.value}
        </div>
      ),
     },
    { field: 'empName', headerName: 'Name', minWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center' },
    { field: 'organizationId', headerName: 'Head of Department', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', align: 'center' },
  ]

  const columnsMap = {
    "employees": columns_emp,
    "organizations": columns_org,
    'domains': columns_domain,
    'branchs': columns_branch,
    'managers': columns_manager,
    'jobs': columns_job,
  };

  const initialColumns = columnsMap[type] || [];

  return (
    <Box
      sx={{
        height: '30%',
        width: '100%',
        '.MuiDataGrid-columnHeaderTitle': {
          fontWeight: 'bold !important',
          overflow: 'visible !important'
        },
        marginTop: 2
      }}
    >
      <div style={{ height: '93vh', width: '100%' }}>
        <DataGrid
          autoHeight={false}
          rows={rows}
          columns={initialColumns}
          getRowId={getRowId}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          slots={{
            toolbar: EditToolbar as GridSlots['toolbar'],
          }}
          slotProps={{
            toolbar: { type, role, handleOpenAddModal },
          }}
          sx={{ height: '100%', width: '100%' }}
        />
      </div>
      <AlertResponse snackbarOpen={snackbarOpen} setSnackbarOpen={setSnackbarOpen} alertMessage={alertMessage} errorResponse={errorResponse} />
      {type === "employees" && (
        <EmployeeModal
          open={openEmployeeModal}
          handleClose={handleCloseAddModal}
          addRecord={addRecord}
          updateRecord={updateRecord}
          deleteRecord={handleDeleteClick}
          setRows={setRows}
          setSnackbarOpen={setSnackbarOpen}
          setAlertMessage={setAlertMessage}
          setError={setError}
          selectedRow={selectedRow}
          role={role}
        />
      )}
      {type === "organizations" && (
        <OrganizationModal
          open={openOrganizationModal}
          handleClose={handleCloseAddModal}
          addRecord={addRecord}
          updateRecord={updateRecord}
          deleteRecord={handleDeleteClick}
          setRows={setRows}
          setSnackbarOpen={setSnackbarOpen}
          setAlertMessage={setAlertMessage}
          setError={setError}
          selectedRow={selectedRow}
          role={role}
        />
      )}
      {type === "jobs" && (
        <JobModal
          open={openJobModal}
          handleClose={handleCloseAddModal}
          addRecord={addRecord}
          updateRecord={updateRecord}
          deleteRecord={handleDeleteClick}
          setRows={setRows}
          setSnackbarOpen={setSnackbarOpen}
          setAlertMessage={setAlertMessage}
          setError={setError}
          selectedRow={selectedRow}
          role={role}
        />
      )}
      {type === "domains" && (
        <DomainModal
          open={openDomainModal}
          handleClose={handleCloseAddModal}
          addRecord={addRecord}
          updateRecord={updateRecord}
          deleteRecord={handleDeleteClick}
          setRows={setRows}
          setSnackbarOpen={setSnackbarOpen}
          setAlertMessage={setAlertMessage}
          setError={setError}
          selectedRow={selectedRow}
          role={role}
        />
      )}
      {type === "branchs" && (
        <BranchModal
          open={openBranchModal}
          handleClose={handleCloseAddModal}
          addRecord={addRecord}
          updateRecord={updateRecord}
          deleteRecord={handleDeleteClick}
          setRows={setRows}
          setSnackbarOpen={setSnackbarOpen}
          setAlertMessage={setAlertMessage}
          setError={setError}
          selectedRow={selectedRow}
          role={role}
        />
      )}
      {type === "managers" && (
        <ManagerModal
          open={openManagerModal}
          handleClose={handleCloseAddModal}
          addRecord={addRecord}
          updateRecord={updateRecord}
          deleteRecord={handleDeleteClick}
          setRows={setRows}
          setSnackbarOpen={setSnackbarOpen}
          setAlertMessage={setAlertMessage}
          setError={setError}
          selectedRow={selectedRow}
          role={role}
        />
      )}

    </Box>
  );
}
