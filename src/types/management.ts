import { GridCellModesModel, GridRowId } from "@mui/x-data-grid";

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

export type { SelectedCellParams, EditToolbarProps}