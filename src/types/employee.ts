export default interface EmployeeNode {
    empId?: string;
    extensionCode?: string;
    directLine?: string;
    email?: string;
    enTitle?: string;
    enFirstName?: string;
    enLastName?: string;
    thTitle?: string;
    thFirstName?: string;
    thLastName?: string;
    nickname?: string;
    corporationTitle?: string;
    jobTitle?: string;
    organizationUnit?: string;
    branchName?: string;
    derivativeTrader?: string;
    derivativeLicense?: string;
    singleTrader?: string;
    singleLicense?: string;
    startWorkingDate?: string;
    lastWorkingDate?: string; // Optional
    effectiveDate?: string;   // Optional
    profileImage?: string;    // Optional
    organizationId?: string;
    branchId?: string;
    jobId?: string;
    managerId?: string;
    domainId?: string;         // Example of missing fields
  }
  