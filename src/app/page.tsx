'use client'
import React from 'react';
import Image from 'next/image';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Sidebar from '@/components/sidebar';
import EmployeeTable from '@/components/employeetable'

const Home = () => {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  return (
    <main className="min-h-screen justify-between bg-white">
      <section id="header">
        <div className="bg-rose-500 p-2"></div>
      </section>

      <section id="logo">
        <div className="flex content-center">
          <div>
            <Image src="/bls-header-logo.png" alt="" width={300} height={300}></Image>
          </div>
          <div>
            <p className="p-5 font-bold xl:text-3xl md:text-xl text-rose-600">StaffInformation</p>
          </div>
        </div>
      </section>

      <hr></hr>
      {/* side bar Department */}
      <section id='sidebar'>
        <div className='flex w-screen overflow-auto'>
          <Sidebar></Sidebar>
          <div className='w-full m-5 border-2 border rounded'>
            {/* Search */}
            <div className="m-3">
              <div className='bg-rose-700 rounded'>
                <p className='text-white font-bold rounded px-5'>Search</p>
              </div>
              <FormControl sx={{ m: 2, minWidth: 200 }} size='small'>
                <InputLabel id="demo-simple-select-label">Search By</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Staff ID</MenuItem>
                  <MenuItem value={20}>Name</MenuItem>
                  <MenuItem value={30}>Organization unit</MenuItem>
                  <MenuItem value={30}>Ex</MenuItem>
                </Select>
              </FormControl>
            </div>
            {/* StaffInformation */}
            <div className='m-3'>
              <div className='bg-rose-700 rounded my-2'>
                <p className='text-white font-bold rounded px-5'>StaffInformation</p>
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
