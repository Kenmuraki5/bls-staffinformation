import * as React from 'react';
import Image from 'next/image';
import { StaffInformationProps } from './type';


const StaffInformation: React.FC<StaffInformationProps> = ({employees}) => {
  const convertDate = (d: string) => {
    const date = new Date(d);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  }

  return (
    <div className="flex flex-col md:flex-row items-start justify-between p-4 md:p-6 rounded-lg shadow-md bg-white text-black">
      <fieldset className="w-full border-2 p-4 md:p-5 flex flex-col md:flex-row">
        <legend>Staff Information</legend>
        <div className="flex-1">
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Staff ID :</label>
            <span className="ml-2 text-base w-full">{employees?.empId}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Extension Code :</label>
            <span className="ml-2 text-base w-full">{employees?.extensionCode}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Direct Line :</label>
            <span className="ml-2 text-base w-full">02618{employees?.extensionCode}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Email :</label>
            <span className="ml-2 text-base w-full">{employees?.email}</span>
          </div>
          <legend className="mt-5">English Name</legend>
          <hr />
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Title :</label>
            <span className="ml-2 text-base w-full">{employees?.enTitle}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">First Name :</label>
            <span className="ml-2 text-base w-full">{employees?.enFirstName}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Last Name :</label>
            <span className="ml-2 text-base w-full">{employees?.enLastName}</span>
          </div>
          <legend className="mt-5">ชื่อไทย</legend>
          <hr />
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">คำนำหน้า :</label>
            <span className="ml-2 text-base w-full">{employees?.thTitle}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">ชื่อจริง :</label>
            <span className="ml-2 text-base w-full">{employees?.thFirstName}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">นามสกุล :</label>
            <span className="ml-2 text-base w-full">{employees?.thLastName}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Nickname :</label>
            <span className="ml-2 text-base w-full"></span>
          </div>
          <hr className="mt-5 mb-5" />
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Corporation Title :</label>
            <span className="ml-2 text-base w-full">{employees?.corporationTitle}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Job Title :</label>
            <span className="ml-2 text-base w-full"></span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Organization Unit :</label>
            <span className="ml-2 text-base w-full">{employees?.organizationUnit}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Branch :</label>
            <span className="ml-2 text-base w-full">{employees?.branchName}</span>
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
            <span className="ml-2 text-base w-full">{employees?.startWorkingDate == '' ? "N/A" : convertDate(employees?.startWorkingDate)}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Last Working Date:</label>
            <span className="ml-2 text-base w-full">{employees?.lastWorkingDate == '' ? "N/A" : convertDate(employees?.lastWorkingDate)}</span>
          </div>
          <div className="mb-4 flex flex-col md:flex-row md:items-center">
            <label className="text-base font-semibold w-full md:w-48 xl:w-64">Effective Date:</label>
            <span className="ml-2 text-base w-full">{employees?.effectiveDate == '' ? "N/A": convertDate(employees?.effectiveDate)}</span>
          </div>
        </div>
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
          <Image src={`http://127.0.0.1:8080/uploads/${employees?.empId}.png`} alt="Staff Image" width={200} height={200} className="rounded-full" />
        </div>
      </fieldset>
    </div>
  );
};

export default StaffInformation;
