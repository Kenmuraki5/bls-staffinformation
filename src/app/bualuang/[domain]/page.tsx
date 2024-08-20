import React from 'react';
import dynamic from 'next/dynamic';
import { getEmployeesByOrgID } from '@/app/api/employees';
import { getAllDepartmentsHeirachy } from '@/app/api/departments';
import handleSearch from '@/app/api/search';

const MainComponent = dynamic(() => import('@/components/dashboard'));
const PersistentDrawerLeft = dynamic(() => import('@/components/drawer'));

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
    <div className="flex flex-col bg-white">
      <PersistentDrawerLeft />
      <MainComponent
        organizations={organizations.organizations || []}
        employees={employees.employees || []}
      />
      <footer className='bg-pink-950 w-full p-2 text-white text-center'>
        Copyright 2011© Bualuang Securities PCL
      </footer>
    </div>
  );
};

export default Home;
