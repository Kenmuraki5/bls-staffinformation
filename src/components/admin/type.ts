import EmployeeNode from "@/types/employee";
import { Organization } from "@/types/organization";
import { GridColDef } from "@mui/x-data-grid";

interface AdminEmployeemanagementProps {
    data: EmployeeNode[] | Organization[] | undefined;
}

export type {AdminEmployeemanagementProps}