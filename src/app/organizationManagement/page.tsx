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
import PersistentDrawerLeft from '@/components/drawer';

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
    {/* add button */}
      <Button>
      <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7 7V5"/>
      </svg>

        ADD RECORD
      </Button>
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
      <PersistentDrawerLeft />
      <DataGrid
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
  { field: 'name', headerName: 'Name', width: 180, editable: true },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    editable: true,
    align: 'left',
    headerAlign: 'left',
  },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
    editable: true,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
    editable: true,
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: "randomTraderName()",
    age: 25,
    dateCreated: new Date("2022-03-25"),
    lastLogin: "",
  },
  {
    id: 2,
    name: "randomTraderName()",
    age: 36,
    dateCreated: new Date("2022-03-25"),
    lastLogin: "",
  },
  {
    id: 3,
    name: "randomTraderName()",
    age: 19,
    dateCreated: new Date("2022-03-25"),
    lastLogin: "",
  },
  {
    id: 4,
    name: "randomTraderName()",
    age: 28,
    dateCreated: new Date("2022-03-25"),
    lastLogin: "",
  },
  {
    id: 5,
    name: "randomTraderName()",
    age: 23,
    dateCreated: new Date("2022-03-25"),
    lastLogin: "",
  },
];
