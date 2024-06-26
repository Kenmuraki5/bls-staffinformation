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
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots,
} from '@mui/x-data-grid';
import { useParams } from 'next/navigation';
import { getToken } from '@/app/lib/action';
import { AdminEmployeemanagementProps } from './type';
import EmployeeNode from '@/types/employee';
import { Organization } from '@/types/organization';
import { Domain } from 'domain';
import Manager from '@/types/manager';
import Branch from '@/types/branch';
import { Alert, Snackbar } from '@mui/material';

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
  type: string
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, type } = props;

  const handleClick = () => {
    const id = Math.floor(Math.random() * 9999).toString();

    if (type === "emp") {
      setRows((oldRows) => [
        ...oldRows,
        {
          empId: id,
          thFirstName: '',
          enFirstName: '',
          email: '',
          organizationUnit: '',
          corporationTitle: '',
          branchId: '',
          extensionCode: '',
          managerId: '',
          isNew: true,
          thTitle: '',
          thLastName: '',
          enTitle: '',
          enLastName: '',
          nickname: '',
          organizationId: '',
          jobId: '',
          derivativeTrader: '',
          derivativeLicense: '',
          singleTrader: '',
          singleLicense: '',
          otherLicense: '',
          startWorkingDate: '',
          lastWorkingDate: '',
          effectiveDate: ''
        }
      ]);
    } else if (type === "org") {
      setRows((oldRows) => [
        ...oldRows,
        { organizationId: id, domainId: '', organizationUnit: '', parentOrganizationId: null, isNew: true }
      ]);
    } else if (type === "domain") {
      setRows((oldRows) => [
        ...oldRows,
        { domainId: id, domainName: '', isNew: true }
      ]);
    } else if (type === "manager") {
      setRows((oldRows) => [
        ...oldRows,
        { managerId: id, empId: '', organizationId: '', isNew: true }
      ]);
    } else if (type === "branch") {
      setRows((oldRows) => [
        ...oldRows,
        { branchId: id, branchName: '', location: '', contact: null, isNew: true }
      ]);
    }

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: type === "emp" ? 'thTitle' : 'managerId' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export const StartEditButtonGrid: React.FC<AdminEmployeemanagementProps & { type: 'emp' | 'org' | 'domain' | 'branch' | "manager" }> = ({ data, type }) => {
  const params = useParams()
  const [rows, setRows] = React.useState<any>(data);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

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

  const handleDeleteClick = (id: GridRowId) => () => {
    deleteRecord(id);
    setRows(rows.filter((row: any) => {
      if (type === 'emp') {
        return row.empId !== id;
      } else if (type === 'org') {
        return row.organizationId !== id;
      } else if (type === 'domain') {
        return row.domainId !== id;
      } else if (type === 'branch') {
        return row.branchId !== id;
      } else if (type === 'manager') {
        return row.managerId !== id;
      }
      return true;
    }));
  };

  async function deleteRecord(id: string | number) {
    try {
      const token = await getToken("session");
      const port = params.manage == "employee" ? 8080 : 8081;
      const res = await fetch(`http://localhost:${port}/staffinformation/${params.manage}/${id}`, {
        method: "DELETE",
        headers: {
          "authorization": token,
          "Content-Type": "application/json"
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to delete ${params.manage}`);
      }
      setSnackbarOpen(true);
      setAlertMessage('Delete successful');
      return res.json();
    } catch (error) {
      console.error(`Error deleting ${params.manage}:`, error);
      return error;
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

  async function updateDB(data: Organization | EmployeeNode) {
    try {
      const token = await getToken("session");
      const payloadData = { ...data };
      const port = params.manage == "employee" ? 8080 : 8081;
      const res = await fetch(`http://localhost:${port}/staffinformation/${params.manage}`, {
        method: "POST",
        headers: {
          "authorization": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payloadData)
      });
  
      if (!res.ok) {
        throw new Error(`Failed to update ${params.manage}`);
      }
      setSnackbarOpen(true);
      setAlertMessage('Update successful');
      return res.json();
    } catch (error) {
      console.error(`Error updating ${params.manage}:`, error);
      return error;
    }
  }

  const processRowUpdate = async (updatedRow: any, originalRow: any) => {
    try {
      const updateRow = await updateDB(updatedRow);
      return updateRow;
    } catch (error) {
      console.error('Error updating department:', error);
      return originalRow;
    }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns_emp: GridColDef[] = [
    { field: 'empId', headerName: 'StaffID', minWidth: 100, maxWidth: 80, flex: 1, editable: true, },
    { field: 'thTitle', headerName: 'thTitle', minWidth: 100, maxWidth: 80, flex: 1, editable: true, },
    { field: 'thFirstName', headerName: 'Thai name', minWidth: 100, maxWidth: 200, flex: 1, editable: true, },
    { field: 'thLastName', headerName: 'Thai Last name', minWidth: 100, maxWidth: 200, flex: 1, editable: true, },
    { field: 'enTitle', headerName: 'EnTitle', minWidth: 100, maxWidth: 200, flex: 1, editable: true, },
    { field: 'enFirstName', headerName: 'eng Name', minWidth: 100, maxWidth: 200, flex: 1, editable: true, },
    { field: 'enLastName', headerName: 'eng LastName', minWidth: 100, maxWidth: 200, flex: 1, editable: true, },
    { field: 'nickname', headerName: 'NickName', minWidth: 100, maxWidth: 200, flex: 1, editable: true, },
    { field: 'email', headerName: 'Email', minWidth: 100, maxWidth: 200, flex: 1, editable: true, },
    { field: 'organizationId', headerName: 'Department', minWidth: 100, maxWidth: 200, flex: 1, editable: true, },
    { field: 'corporationTitle', headerName: 'CorporationTitle', minWidth: 100, maxWidth: 200, flex: 1, editable: true, },
    { field: 'branchId', headerName: 'BranchId', minWidth: 100, maxWidth: 80, flex: 1, editable: true, },
    { field: 'jobId', headerName: 'jobId', minWidth: 100, maxWidth: 80, flex: 1, editable: true, },
    { field: 'extensionCode', headerName: 'ExtensionCode', minWidth: 100, maxWidth: 120, flex: 1, editable: true, },
    { field: 'derivativeTrader', headerName: 'derivativeTrader', minWidth: 100, maxWidth: 120, flex: 1, editable: true, },
    { field: 'derivativeLicense', headerName: 'derivativeLicense', minWidth: 100, maxWidth: 120, flex: 1, editable: true, },
    { field: 'singleTrader', headerName: 'singleTrader', minWidth: 100, maxWidth: 120, flex: 1, editable: true, },
    { field: 'singleLicense', headerName: 'singleLicense', minWidth: 100, maxWidth: 120, flex: 1, editable: true, },
    { field: 'otherLicense', headerName: 'otherLicense', minWidth: 100, maxWidth: 120, flex: 1, editable: true, },
    { field: 'startWorkingDate', headerName: 'startWorkingDate', minWidth: 100, maxWidth: 120, flex: 1, editable: true, },
    { field: 'lastWorkingDate', headerName: 'lastWorkingDate', minWidth: 100, maxWidth: 120, flex: 1, editable: true, },
    { field: 'effectiveDate', headerName: 'effectiveDate', minWidth: 100, maxWidth: 120, flex: 1, editable: true, },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
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
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const columns_org: GridColDef[] = [
    { field: 'organizationId', headerName: 'Organization ID', minWidth: 100, flex: 1, editable: true },
    { field: 'domainId', headerName: 'Domain ID', minWidth: 100, flex: 1, editable: true },
    { field: 'organizationUnit', headerName: 'Organization Unit', minWidth: 100, flex: 1, editable: true },
    { field: 'parentOrganizationId', headerName: 'Parent Organization ID', minWidth: 100, flex: 1, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
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
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  const columns_domain: GridColDef[] = [
    { field: 'domainId', headerName: 'Domain ID', minWidth: 100, flex: 1, editable: true },
    { field: 'domainName', headerName: 'Domain Name', minWidth: 100, flex: 1, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
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
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ]

  const columns_branch: GridColDef[] = [
    { field: 'branchId', headerName: 'Domain ID', minWidth: 100, flex: 1, editable: true },
    { field: 'branchName', headerName: 'Branch Name', minWidth: 100, flex: 1, editable: true },
    { field: 'location', headerName: 'location', minWidth: 100, flex: 1, editable: true },
    { field: 'contact', headerName: 'Contact', minWidth: 100, flex: 1, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
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
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ]

  const columns_manager: GridColDef[] = [
    { field: 'managerId', headerName: 'Manager ID', minWidth: 100, flex: 1, editable: true },
    { field: 'empId', headerName: 'Employee ID', minWidth: 100, flex: 1, editable: true },
    { field: 'organizationId', headerName: 'Organization ID', minWidth: 100, flex: 1, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
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
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ]

  const getRowId = (row: EmployeeNode | Organization | Domain | Manager | Branch): GridRowId => {
    if ('managerId' in row) {
      return row.managerId as string;
    }
    if ('empId' in row) {
      return row.empId as string;
    } else if ('organizationId' in row) {
      return row.organizationId as string;
    } else if ('domainId' in row) {
      return row.domainId as string;
    } else if ('managerId' in row) {
      return row.managerId as string;
    } else if ('branchId' in row) {
      return row.branchId as string;
    }

    return '';
  };



  const columns = type === 'emp' ? columns_emp : type === "org" ? columns_org : type === "domain" ? columns_domain : type === "branch" ? columns_branch : columns_manager;

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
      }}
    >
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
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
          toolbar: { setRows, setRowModesModel, type },
        }}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
