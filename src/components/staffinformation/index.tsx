'use client'
import React, { useState } from "react";
import {
  Person as PersonIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarTodayIcon,
  Bookmark as BookmarkIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import PlaceIcon from '@mui/icons-material/Place';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import BusinessIcon from '@mui/icons-material/Business';
import { Description } from '@mui/icons-material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BadgeIcon from '@mui/icons-material/Badge';
import { StaffInformationProps } from "./type";
import { Alert, Snackbar } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Image from "next/image";
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useParams } from "next/navigation";
import { useRouter } from 'next/navigation';

const StaffProfile: React.FC<StaffInformationProps> = ({ staffData }: any) => {

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const params: any = useParams();
  const convertDate = (d: string) => {
    const date = new Date(d);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleString('en-GB', options);
  }


  const parseLicenses = (licenseString: string) => {
    const regex = /<Name>(.*?)<\/Name>/g;
    const matches = licenseString.match(regex);
    return matches ? matches.map(match => match.replace(/<\/?Name>/g, '') + ':') : [];
  };

  const licensesArray = staffData?.otherLicense ? parseLicenses(staffData.otherLicense) : [];

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setOpenSnackbar(true);  // Show Snackbar with alert message
    }).catch((err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };


  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-52 bg-gradient-to-r from-[#172554] to-[#1e3a8a]">
          <button onClick={handleGoBack} className="absolute top-4 left-4 mt-5 text-white">
            <KeyboardArrowLeftIcon />
          </button>

          <div className="absolute -bottom-16 left-10">
            <div className="relative w-48 h-48">
              <Image
                src={`http://bualuangintranet.sawasdee.brk1/employee/img/staff/${staffData?.empId.toString().padStart(4, '0')}.jpg`}
                alt="Profile"
                fill
                className="bg-white rounded-full border-4 border-white shadow-lg object-cover object-top"
              />
            </div>
          </div>


        </div>

        {/* Main Content */}
        <div className="pt-24 px-10 pb-10">
          {/* Basic Information */}
          <div className="mb-8">
            <div className="flex items-center mb-4 border-b pb-2">
              {["BLS", "BCAP"].includes(params?.domain) && (
                <Image
                  src={`/${params?.domain?.toLowerCase()}.png`}
                  alt={`${params?.domain} LOGO`}
                  width={42}
                  height={42}
                  priority
                />
              )}
              <h2 className="text-xl font-bold text-gray-900">Staff Information</h2>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <ContactEmergencyIcon className="mr-2" /> Staff ID
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(staffData?.empId?.toString().padStart(4, '0') || '')}>
                  {staffData?.empId?.toString().padStart(4, '0')}
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <ContactPhoneIcon className="mr-2" /> Extension
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(staffData?.extensionCode || '')}>
                  {staffData?.extensionCode}
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <PhoneIcon className="mr-2" /> DirectLine
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(staffData?.directLine?.length === 8 && !staffData.directLine.startsWith('0') ? `0${staffData.directLine}` : staffData?.directLine || '')}>
                  {staffData?.directLine?.length === 8 && !staffData.directLine.startsWith('0') ? `0${staffData.directLine}` : staffData?.directLine}
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <MailIcon className="mr-2" /> Email
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(staffData?.email)}>
                  {staffData?.email}
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <PersonIcon className="mr-2" /> English Name
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(`${staffData?.enTitle}${staffData?.enFirstName} ${staffData?.enLastName}`)}>
                  {`${staffData?.enTitle}${staffData?.enFirstName} ${staffData?.enLastName}`}
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <PersonIcon className="mr-2" /> Thai Name
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(`${staffData?.thTitle}${staffData?.thFirstName} ${staffData?.thLastName}`)}>
                  {`${staffData?.thTitle}${staffData?.thFirstName} ${staffData?.thLastName}`}
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <BookmarkIcon className="mr-2" /> Nickname
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(staffData?.nickname || '')}>
                  {staffData?.nickname}
                </p>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="mb-8">
            <h2 className="text-base font-bold text-gray-900 mb-4 border-b">Organization</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <BusinessCenterIcon className="mr-2" /> Corporation Title
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(staffData?.corporationTitle || '')}>
                  {staffData?.corporationTitle}
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <WorkIcon className="mr-2" /> Job Title
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(staffData?.jobTitle || '')}>
                  {staffData?.jobTitle}
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <BusinessIcon className="mr-2" /> Organization Unit
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(staffData?.organizationUnit || '')}>
                  {staffData?.organizationUnit}
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <PlaceIcon className="mr-2" /> Branch
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(staffData?.branchName || '')}>
                  {staffData?.branchName}
                </p>
              </div>
            </div>
          </div>

          {/* License Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Licenses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="flex items-center text-gray-600 mb-2">
                  <AccountBoxIcon className="mr-2 text-blue-500" /> Derivative Trader
                </h3>
                <p className="text-gray-600">{staffData?.derivativeTrader == "" ? "-" : staffData?.derivativeTrader}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="flex items-center text-gray-600 mb-2">
                  <AssuredWorkloadIcon className="mr-2 text-blue-500" /> Derivative License
                </h3>
                <p className="text-gray-600">{staffData?.derivativeLicense == "" ? "-" : staffData?.derivativeLicense}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="flex items-center text-gray-600 mb-2">
                  <BadgeIcon className="mr-2 text-red-500" /> Single(Equity) Trader
                </h3>
                <p className="text-gray-600">{staffData?.singleTrader == "" ? "-" : staffData?.singleTrader}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="flex items-center text-gray-600 mb-2">
                  <AssignmentIndIcon className="mr-2 text-red-500" /> Single(Equity) License
                </h3>
                <p className="text-gray-600">{staffData?.singleLicense == "" ? "-" : staffData?.singleLicense}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="flex items-center text-gray-600 mb-2">
                  <Description className="mr-2 text-purple-500" /> Other License
                </h3>
                {licensesArray.length > 0 ? (
                  licensesArray.map((license, index) => (
                    <div key={index}>{license}</div>
                  ))
                ) : (
                  <div>-</div>
                )}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b">Work Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5">
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <CalendarTodayIcon className="mr-2" /> Start Date
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(convertDate(staffData?.startWorkingDate))}>
                  {staffData?.startWorkingDate == '' ? "N/A" : convertDate(staffData?.startWorkingDate)}
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <CalendarTodayIcon className="mr-2" /> Last Working Day
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(convertDate(staffData?.lastWorkingDate))}>
                  {staffData?.lastWorkingDate == '' ? "N/A" : convertDate(staffData?.lastWorkingDate)}
                </p>
              </div>
              <div>
                <h3 className="flex items-center text-gray-600 mb-2">
                  <CalendarTodayIcon className="mr-2" /> Effective Date
                </h3>
                <p className="text-base font-normal" onDoubleClick={(e) => handleCopyToClipboard(convertDate(staffData?.effectiveDate))}>
                  {staffData?.effectiveDate == '' ? "N/A" : convertDate(staffData?.effectiveDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Snackbar for Copy Confirmation */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
          Text copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StaffProfile;
