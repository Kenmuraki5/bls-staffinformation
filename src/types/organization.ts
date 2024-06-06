export default interface OrganizationNode {
    organizationId: string;
    organizationUnit: string;
    domainId: string;
    children?: OrganizationNode[];
}