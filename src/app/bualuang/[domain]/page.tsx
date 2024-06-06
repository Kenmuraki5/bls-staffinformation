import React from 'react';
import dynamic from 'next/dynamic';
import getEmployees from '@/app/lib/employees';
import getDepartments from '@/app/lib/departments';



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
        <MainComponent organizations={organizations.organizations || []} employees={employees.employees || []} />
      </main>
      <footer className='bg-pink-950 w-full p-2 text-white text-center'>
        Copyright 2011© Bualuang Securities PCL
      </footer>
    </div>
  );
};

export default Home;
