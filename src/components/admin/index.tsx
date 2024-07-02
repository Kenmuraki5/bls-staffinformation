'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowEditStopReasons,
  GridSlots,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import { getRole, getToken } from '@/app/lib/action';
import { AdminEmployeemanagementProps } from './type';
import EmployeeNode from '@/types/employee';
import { Organization } from '@/types/organization';
import { Domain } from 'domain';
import Manager from '@/types/manager';
import Branch from '@/types/branch';
import { Alert, Snackbar } from '@mui/material';
import Job from '@/types/job';
import UploadPicture from '../uploadpicture';
import { generateNewRow } from './generateNewRole';
import Image from 'next/image';

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
  type: string,
  role: any
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, type, role } = props;

  const handleClick = () => {
    const id = Math.floor(Math.random() * 9999).toString();
  
    setRows((oldRows) => [
      generateNewRow(type, id),
      ...oldRows
    ]);
  
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: type === "emp" ? 'thTitle' : 'managerId' },
    }));
  };

  return (
    <GridToolbarContainer>
      {
        role == "admin" && (<Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>)
      }
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export const StartEditButtonGrid: React.FC<AdminEmployeemanagementProps & { type: 'emp' | 'org' | 'domain' | 'branch' | "manager" | "job" }> = ({ data, type }) => {
  const params = useParams()
  const [rows, setRows] = React.useState<any>(data);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [errorResponse, setError] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [employeeId, setEmployeeId] = React.useState('');
  const [role, setRole] = React.useState<any>(null);

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    async function fetchRole() {
      try {
        const roleData = await getRole();
        setRole(roleData.role);
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

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => async () => {
    try {
      await deleteRecord(id);
      setRows(rows.filter((row: any) => {
        switch (type) {
          case 'emp':
            return row.empId !== id;
          case 'org':
            return row.organizationId !== id;
          case 'domain':
            return row.domainId !== id;
          case 'branch':
            return row.branchId !== id;
          case 'manager':
            return row.managerId !== id;
          default:
            return true;
        }
      }));
      setSnackbarOpen(true);
      setError(false);
      setAlertMessage('Successfully Deleted');
    } catch (error: any) {
      setSnackbarOpen(true);
      setError(true);
      setAlertMessage(error.message);
    }
  };

  async function deleteRecord(id: string | number) {
    try {
      const token = await getToken("session");
      const port = 8080;
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_BASEURL}:${port}/staffinformation/${params.manage}/${id}`, {
        method: "DELETE",
        headers: {
          "authorization": token,
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
  

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row: any) => row.id === id);
    if (editedRow && editedRow.isNew) {
      setRows(rows.filter((row: any) => row.id !== id));
    }
  };

  async function updateRecord(data: any) {
    try {
      const token = await getToken("session");
      const payloadData = { ...data };
      const port = 8080;
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_BASEURL}:${port}/staffinformation/${params.manage}`, {
        method: "POST",
        headers: {
          "authorization": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadData)
      });

      const responseData = await res.json();
      if (!res.ok) {
        const errorMessage = responseData.message || `Failed to update: ${res.statusText}`;
        throw new Error(errorMessage);
      }
      return responseData;
    } catch (error:any) {
      throw new Error(error);
    }
  }


  const processRowUpdate = async (updatedRow: any, originalRow: any) => {
    try {
      const updateRow = await updateRecord(updatedRow);
      setSnackbarOpen(true);
      setError(false);
      setAlertMessage('Successfully Updated');
      return updateRow;
    } catch (error: any) {
      setSnackbarOpen(true);
      setError(true);
      setAlertMessage(error.message);
      console.error(`Error updating ${params.manage}:`, error);
      return originalRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleClickOpen = (id: any) => {
    setEmployeeId(id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getRowId = (row: EmployeeNode | Manager | Organization | Domain | Branch | Job): GridRowId => {
    if ('managerId' in row && 'empId' in row && 'organizationId' in row && Object.keys(row).length === 3) {
      return row.managerId as string;
    } else if ('empId' in row && 'organizationId' in row && 'organizationUnit' in row) {
      return row.empId as string;
    } else if ('organizationId' in row) {
      return row.organizationId as string;
    } else if ('domainId' in row) {
      return row.domainId as string;
    } else if ('branchId' in row) {
      return row.branchId as string;
    } else if ('jobId' in row) {
      return row.jobId as string;
    }
    return '';
  };

  const columns_emp: GridColDef[] = [
    { field: 'empId', headerName: 'StaffID', minWidth: 100, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, hideable: true},
    { field: 'thTitle', headerName: 'thTitle', minWidth: 100, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'thFirstName', headerName: 'Thai name', minWidth: 100, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'thLastName', headerName: 'Thai Last name', minWidth: 120, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'enTitle', headerName: 'EnTitle', minWidth: 100, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'enFirstName', headerName: 'eng Name', minWidth: 120, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'enLastName', headerName: 'eng LastName', minWidth: 120, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'nickname', headerName: 'NickName', minWidth: 100, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'email', headerName: 'Email', minWidth: 200, maxWidth: 300, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'organizationId', headerName: 'Department', minWidth: 100, maxWidth: 200, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'corporationTitle', headerName: 'CorporationTitle', minWidth: 200, maxWidth: 400, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'branchId', headerName: 'BranchId', minWidth: 100, maxWidth: 80, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'jobId', headerName: 'jobId', minWidth: 100, maxWidth: 80, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'extensionCode', headerName: 'ExtensionCode', minWidth: 120, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'derivativeTrader', headerName: 'derivativeTrader', minWidth: 120, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'derivativeLicense', headerName: 'derivativeLicense', minWidth: 140, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'singleTrader', headerName: 'singleTrader', minWidth: 100, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'singleLicense', headerName: 'singleLicense', minWidth: 100, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'otherLicense', headerName: 'otherLicense', minWidth: 140, maxWidth: 160, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'startWorkingDate', headerName: 'startWorkingDate', minWidth: 140, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'lastWorkingDate', headerName: 'lastWorkingDate', minWidth: 140, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    { field: 'effectiveDate', headerName: 'effectiveDate', minWidth: 140, maxWidth: 120, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true, },
    {
      field: 'image',
      headerName: 'Image',
      minWidth: 100, maxWidth: 120,
      headerAlign: 'center',
      headerClassName: 'super-app-theme--header',
      editable: false,
      renderCell: ({ id }) => (
        <Image
          priority
          src={`http://${process.env.NEXT_PUBLIC_BASEURL}:8080/uploads/${id}.png`}
          width={40}
          height={40}
          alt="employee"
          className="cursor-pointer"
          onClick={() => role == "admin" ? handleClickOpen(id) : ""}
          style={{ width: 50, height: 50, borderRadius: '50%' }}
        />
      ),
    },
  ];

  const columns_org: GridColDef[] = [
    { field: 'organizationId', headerName: 'Organization ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
    { field: 'domainId', headerName: 'Domain ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
    { field: 'organizationUnit', headerName: 'Organization Unit', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
    { field: 'parentOrganizationId', headerName: 'Parent Organization ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
  ];
  
  const columns_domain: GridColDef[] = [
    { field: 'domainId', headerName: 'Domain ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
    { field: 'domainName', headerName: 'Domain Name', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
  ]
  
  const columns_branch: GridColDef[] = [
    { field: 'branchId', headerName: 'Domain ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
    { field: 'branchName', headerName: 'Branch Name', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
    { field: 'location', headerName: 'location', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
    { field: 'contact', headerName: 'Contact', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
  ]
  
  const columns_job: GridColDef[] = [
    { field: 'jobId', headerName: 'Job ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
    { field: 'jobTitle', headerName: 'Job Title', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
  ]
  
  const columns_manager: GridColDef[] = [
    { field: 'managerId', headerName: 'Manager ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
    { field: 'empId', headerName: 'Employee ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
    { field: 'organizationId', headerName: 'Organization ID', minWidth: 100, flex: 1, headerAlign: 'center', headerClassName: 'super-app-theme--header', editable: true },
  ]



  const columnsMap = {
    'emp': columns_emp,
    'org': columns_org,
    'domain': columns_domain,
    'branch': columns_branch,
    'manager': columns_manager,
    'job': columns_job,
  };
  
  const initialColumns = columnsMap[type] || [];


  if (role === 'admin') {
    initialColumns.push({
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      headerAlign: 'center', headerClassName: 'super-app-theme--header',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }: { id: GridRowId }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={id}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
  
        return [
          <GridActionsCellItem
            key={id}
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    });
  }
  return (
    <Box
      sx={{
        height: '30%',
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
        '.MuiDataGrid-columnHeaderTitle': {
          fontWeight: 'bold !important',
          color: 'white',
          overflow: 'visible !important'
        },
        '.super-app-theme--header': {
          backgroundColor: 'rgb(244 63 94)',
        },
      }}
    >
      <DataGrid
        isCellEditable={() => role == "admin"}
        autoHeight
        rows={rows}
        columns={initialColumns}
        getRowId={getRowId}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar as GridSlots['toolbar'],
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, type, role },
        }}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={!errorResponse ? "success" : "error"} variant="filled">
          {alertMessage}
        </Alert>
      </Snackbar>
      <UploadPicture open={open} close={handleClose} employeeID={employeeId} alert={setSnackbarOpen} alertMessage={setAlertMessage} />
    </Box>
  );
}
