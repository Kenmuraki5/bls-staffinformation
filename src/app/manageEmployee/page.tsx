'use client'
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  GridColDef,
  GridRowsProp,
  DataGrid,
  GridRowId,
  GridCellModes,
  GridEventListener,
  GridCellModesModel,
  GridSlots,
} from '@mui/x-data-grid';

interface SelectedCellParams {
  id: GridRowId;
  field: string;
}

interface EditToolbarProps {
  selectedCellParams?: SelectedCellParams;
  cellModesModel: GridCellModesModel;
  setCellModesModel: (value: GridCellModesModel) => void;
  cellMode: 'view' | 'edit';
}

function EditToolbar(props: EditToolbarProps) {
  const { selectedCellParams, cellMode, cellModesModel, setCellModesModel } = props;

  const handleSaveOrEdit = () => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field } = selectedCellParams;
    if (cellMode === 'edit') {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.View } },
      });
    } else {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.Edit } },
      });
    }
  };

  const handleCancel = () => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field } = selectedCellParams;
    setCellModesModel({
      ...cellModesModel,
      [id]: {
        ...cellModesModel[id],
        [field]: { mode: GridCellModes.View, ignoreModifications: true },
      },
    });
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    // Keep the focus in the cell
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        p: 1,
      }}
    >
      <Button
        onClick={handleSaveOrEdit}
        onMouseDown={handleMouseDown}
        disabled={!selectedCellParams}
        variant="outlined"
      >
        {cellMode === 'edit' ? 'Save' : 'Edit'}
      </Button>
      <Button
        onClick={handleCancel}
        onMouseDown={handleMouseDown}
        disabled={cellMode === 'view'}
        variant="outlined"
        sx={{ ml: 1 }}
      >
        Cancel
      </Button>
    </Box>
  );
}

export default function StartEditButtonGrid() {
  const [selectedCellParams, setSelectedCellParams] =
    React.useState<SelectedCellParams | null>(null);
  const [cellModesModel, setCellModesModel] = React.useState<GridCellModesModel>({});

  const handleCellFocus = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const row = event.currentTarget.parentElement;
      const id = row!.dataset.id!;
      const field = event.currentTarget.dataset.field!;
      setSelectedCellParams({ id, field });
    },
    [],
  );

  const cellMode = React.useMemo(() => {
    if (!selectedCellParams) {
      return 'view';
    }
    const { id, field } = selectedCellParams;
    return cellModesModel[id]?.[field]?.mode || 'view';
  }, [cellModesModel, selectedCellParams]);

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      if (cellMode === 'edit') {
        // Prevents calling event.preventDefault() if Tab is pressed on a cell in edit mode
        event.defaultMuiPrevented = true;
      }
    },
    [cellMode],
  );

  const handleCellEditStop = React.useCallback<GridEventListener<'cellEditStop'>>(
    (params, event) => {
      event.defaultMuiPrevented = true;
    },
    [],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        getRowId={(row) => row.empId}
        rows={rows}
        columns={columns}
        onCellKeyDown={handleCellKeyDown}
        cellModesModel={cellModesModel}
        onCellEditStop={handleCellEditStop}
        onCellModesModelChange={(model) => setCellModesModel(model)}
        slots={{
          toolbar: EditToolbar as GridSlots['toolbar'],
        }}
        slotProps={{
          toolbar: {
            cellMode,
            selectedCellParams,
            setSelectedCellParams,
            cellModesModel,
            setCellModesModel,
          },
          cell: {
            onFocus: handleCellFocus,
          },
        }}
      />
    </div>
  );
}

const columns: GridColDef[] = [
  { field: 'empId', headerName: 'StaffID', minWidth: 100, maxWidth: 100, flex: 1, },
  { field: 'thFirstName', headerName: 'Thai name', minWidth: 100, maxWidth: 200, flex: 1 },
  { field: 'enFirstName', headerName: 'eng name', minWidth: 100, maxWidth: 200, flex: 1 },
  { field: 'email', headerName: 'Email', minWidth: 100, maxWidth: 200, flex: 1 },
  { field: 'organizationUnit', headerName: 'Department', minWidth: 100, maxWidth: 200, flex: 1 },
  { field: 'corporationTitle', headerName: 'CorporationTitle', minWidth: 100, maxWidth: 200, flex: 1 },
  { field: 'branchId', headerName: 'Branch', minWidth: 100, maxWidth: 80, flex: 1 },
  { field: 'extensionCode', headerName: 'ExtensionCode', minWidth: 100, maxWidth: 120, flex: 1 },
  { field: 'managerId', headerName: 'managerID', minWidth: 100, maxWidth: 120, flex: 1  },
];1
const rows: GridRowsProp = [
  {
    empId: 1,
    name: "kenmrauki",
    age: 25,
    dateCreated: new Date("2022-03-25"),
    lastLogin: new Date("2022-03-25"),
  },
  {
    empId: 2,
    name: "kenmrauki",
    age: 36,
    dateCreated: new Date("2022-03-25"),
    lastLogin: new Date("2022-03-25"),
  },
  {
    empId: 3,
    name: "kenmrauki",
    age: 19,
    dateCreated: new Date("2022-03-25"),
    lastLogin: new Date("2022-03-25"),
  },
  {
    empId: 4,
    name: "kenmrauki",
    age: 28,
    dateCreated: new Date("2022-03-25"),
    lastLogin: new Date("2022-03-25"),
  },
  {
    empId: 5,
    name: "kenmrauki",
    age: 23,
    dateCreated: new Date("2022-03-25"),
    lastLogin: new Date("2022-03-25"),
  },
];