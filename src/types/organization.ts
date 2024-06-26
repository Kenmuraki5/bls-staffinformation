export interface OrganizationNode {
    organizationId: string;
    organizationUnit: string;
    domainId: string;
    children?: OrganizationNode[];
}

export interface Organization {
    organizationId: string;
    domainId: string;
    organizationUnit: string;
    parentOrganizationId: string;
    level: number;
    children: Organization[];
}
