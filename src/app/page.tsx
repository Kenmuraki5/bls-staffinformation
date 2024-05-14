import React from 'react';
import Sidebar from '@/components/sidebar';
import EmployeeTable from '@/components/employeetable'
import Search from '@/components/search';
import PersistentDrawerLeft from '@/components/drawer';

async function getDepartments(domain_id: string) {
  const res = await fetch(`http://localhost:3000/departments/${domain_id}`)
  return res.json()
}

const Home = async () => {

  const test:any = await getDepartments("1");

  return (
    <main className="min-h-screen justify-between bg-white">
       <PersistentDrawerLeft></PersistentDrawerLeft>
      <hr></hr>
      {/* side bar Department */}
      <section id='sidebar'>
        <div className='flex w-screen overflow-auto'>
          <Sidebar departments={ test } />
          <div className='w-full m-5 border-2 border rounded'>
            {/* Search */}
            <Search />
            {/* StaffInformation */}
            <div className='m-3'>
              <div className='bg-rose-700 rounded my-5'>
                <p className='text-white font-bold rounded px-5'>Staff Information</p>
              </div>
              <EmployeeTable />
            </div>
          </div>
        </div>
      </section>
      <footer className='bg-rose-700 w-screen p-5'></footer>
    </main>
  );
};

export default Home;
