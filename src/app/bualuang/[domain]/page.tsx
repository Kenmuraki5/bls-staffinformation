import React from 'react';
import dynamic from 'next/dynamic';
import { getEmployee, getEmployeesByOrgID } from '@/app/api/employees';
import { getAllDepartmentsHeirachy } from '@/app/api/departments';
import handleSearch from '@/app/api/search';
import PageNotAvailable from '@/components/notavailable';
import { notFound } from 'next/navigation';

const MainComponent = dynamic(() => import('@/components/dashboard'));

const Home = async ({
  params,
  searchParams,
}: {
  params: { domain: string, orgId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const domain = params.domain;
  const organizations: any = await getAllDepartmentsHeirachy(domain);

  let employees: any = {};
  let staffData: any = {};
  if (!searchParams?.searchBy) {
    employees = await getEmployeesByOrgID(params.domain as string, searchParams?.organizationId as string);
    if (searchParams?.empId) {
      staffData = await getEmployee(params.domain, searchParams?.empId as string);
    }
  } else {
    employees = await handleSearch(
      searchParams?.searchBy as string,
      searchParams?.searchInput as string,
      params?.domain as string
    );
  }

  const allowedDomains = ['BLS', 'BCAP'];
  if (!allowedDomains.includes(domain)) {
    notFound();
  }

  if (!organizations || organizations.length === 0) {
    return <PageNotAvailable />;
  }
  
  return (
    <MainComponent
      organizations={organizations?.organizations || []}
      employees={employees?.employees || []}
      staffData={staffData?.employee || null}
    />
  );
  
};

export default Home;
