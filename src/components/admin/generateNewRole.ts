export const generateNewRow = (type: string, id: string) => {
  const rowTemplates: any = {
    'emp': {
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
    },
    'org': { organizationId: id, domainId: '', organizationUnit: '', parentOrganizationId: null, isNew: true },
    'domain': { domainId: id, domainName: '', isNew: true },
    'manager': { managerId: id, empId: '', organizationId: '', isNew: true },
    'branch': { branchId: id, branchName: '', location: '', contact: null, isNew: true },
    'job': { jobId: id, jobTitle: '', isNew: true },
  };

  return rowTemplates[type] || {};
};