import React from 'react';
import dynamic from 'next/dynamic';
import { getEmployeesByOrgID } from '@/app/api/employees';
import { getAllDepartmentsHeirachy } from '@/app/api/departments';
import handleSearch from '@/app/api/search';
import PageNotAvailable from '@/components/notavailable';

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

  if (!searchParams?.searchBy) {
    employees = await getEmployeesByOrgID(params.domain as string, searchParams?.organizationId as string);
  } else {
    employees = await handleSearch(
      searchParams?.searchBy as string,
      searchParams?.searchInput as string,
      params?.domain as string
    );
  }
  return (
    <div>
      {organizations.length != 0  ? (<MainComponent
        organizations={organizations?.organizations || []}
        employees={employees?.employees || []}
      />) : (<PageNotAvailable/>)}
    </div>
  );
};

export default Home;
