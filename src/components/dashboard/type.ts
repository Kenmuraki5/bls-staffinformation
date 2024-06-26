import EmployeeNode from "@/types/employee";
import {OrganizationNode} from "@/types/organization";

interface DashboardProps {
    organizations: OrganizationNode[];
    employees: EmployeeNode[];
}

interface StyledTreeItemProps {
    isselected: boolean;
    haschildren?: boolean;
}

export type {
    DashboardProps,
    StyledTreeItemProps
}

