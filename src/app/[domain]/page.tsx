import React from 'react';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation'

async function getDepartments(domainID: string | string[] | undefined) {
  if (domainID == undefined){
    domainID = "BLS"
  }
  try {
    const res = await fetch(`http://localhost:8081/organizations/${domainID}`);
    if (!res.ok) {
      throw new Error('Failed to fetch departments');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
}

async function getEmployees(domainID: string | string[] | undefined, orgID: string | string[] | undefined) {
  try {
    const res = await fetch(`http://localhost:8080/v1/employeeOrg/${domainID}/${orgID}`);
    if (!res.ok) {
      throw new Error('Failed to fetch employees');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}


const MainComponent = dynamic(() => import('@/components/dashboard'));
const PersistentDrawerLeft = dynamic(() => import('@/components/drawer'));

const Home = async ({
  params,
  searchParams,
}: {
  params: { domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const organizations: any = await getDepartments(params.domain);
  const employees: any = await getEmployees(searchParams?.domain, searchParams?.organizationId)
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-white overflow-scroll">
        <PersistentDrawerLeft />
        <MainComponent organizations={organizations.organizations} employees={employees.employees} />
      </main>
      <footer className='bg-pink-950 w-full p-2 text-white text-center'>
        Copyright 2011© Bualuang Securities PCL
      </footer>
    </div>
  );
};

export default Home;
