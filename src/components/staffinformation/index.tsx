'use client'
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

async function getEmployee(empId: string) {
  try {
    const res = await fetch(`http://localhost:8080/v1/employee/${empId}`);
    if (!res.ok) {
      throw new Error('Failed to fetch employees');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}

const StaffInformation = () => {
  const [data, setData] = useState<any>(null)
  const params = useParams<{ id: string; }>()

  useEffect(() => {
    if (params.id) {
      getEmployee(params.id).then(fetchedData => {
        console.log(fetchedData);
        setData(fetchedData);
      });
    }
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row items-start justify-between p-4 md:p-6 rounded-lg shadow-md bg-white text-black">
      <fieldset className="w-full border-2 p-4 md:p-5 flex flex-col md:flex-row">
        <legend>Staff Information</legend>
        <div className="flex-1">
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Staff ID :</label>
            <span className="ml-2 text-base w-full">{data.employee.empId}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Extension Code :</label>
            <span className="ml-2 text-base w-full">{data.employee.extensionCode}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Direct Line :</label>
            <span className="ml-2 text-base w-full">02618{data.employee.extensionCode}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Email :</label>
            <span className="ml-2 text-base w-full">{data.employee.email}</span>
          </div>
          <legend className="mt-5">English Name</legend>
          <hr />
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Title :</label>
            <span className="ml-2 text-base w-full">{data.employee.enTitle}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">First Name :</label>
            <span className="ml-2 text-base w-full">{data.employee.enFirstName}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Last Name :</label>
            <span className="ml-2 text-base w-full">{data.employee.enLastName}</span>
          </div>
          <legend className="mt-5">ชื่อไทย</legend>
          <hr />
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">คำนำหน้า :</label>
            <span className="ml-2 text-base w-full">{data.employee.thTitle}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">ชื่อจริง :</label>
            <span className="ml-2 text-base w-full">{data.employee.thFirstName}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">นามสกุล :</label>
            <span className="ml-2 text-base w-full">{data.employee.thLastName}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Nickname :</label>
            <span className="ml-2 text-base w-full"></span>
          </div>
          <hr className="mt-5 mb-5" />
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Corporation Title :</label>
            <span className="ml-2 text-base w-full">{data.employee.corporationTitle}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Job Title :</label>
            <span className="ml-2 text-base w-full"></span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Organization Unit :</label>
            <span className="ml-2 text-base w-full">Information Technology Department / ฝ่ายเทคโนโลยีสารสนเทศ</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Branch :</label>
            <span className="ml-2 text-base w-full">Head Office / สำนักงานใหญ่</span>
          </div>
          <div className="mb-4 mt-10 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Derivative Trader :</label>
            <span className="ml-2 text-base w-full"></span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Derivative license :</label>
            <span className="ml-2 text-base w-full"></span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Single (Equity) Trader:</label>
            <span className="ml-2 text-base w-full"></span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Single (Equity) License:</label>
            <span className="ml-2 text-base w-full"></span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Other License:</label>
            <span className="ml-2 text-base w-full"></span>
          </div>
          <div className="mb-4 mt-10 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Start Working Date:</label>
            <span className="ml-2 text-base w-full">12/05/2001</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Last Working Date:</label>
            <span className="ml-2 text-base w-full">N/A</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Effective Date:</label>
            <span className="ml-2 text-base w-full">N/A</span>
          </div>
        </div>
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
          <Image src="/test.png" alt="Staff Image" width={200} height={200} className="rounded-full" />
        </div>
      </fieldset>
    </div>
  );
};

export default StaffInformation;
