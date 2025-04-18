import * as React from 'react';
import UploadEditEmployees from '@/components/admin/UploadEmployeeFile';

export default async function AdminEmployeeManagement({
  params,
  searchParams,
}: {
  params: { manage: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {

  return (
    <div className="min-h-fill bg-white flex flex-col overflow-y-visible">
      <UploadEditEmployees />
    </div>
  );
}
