import * as React from 'react';
import { getAllEmployees } from '../../api/employees';
import { StartEditButtonGrid } from '@/components/admin';
import { getAllDepartments } from '@/app/api/departments';
import { getAlldomain } from '@/app/api/domain';
import { getAllBranch } from '@/app/api/branch';
import { getAllManager } from '@/app/api/manager';
import { getAllJob } from '@/app/api/job';
import PageNotAvailable from '@/components/notavailable';

export default async function AdminEmployeeManagement({
  params,
  searchParams,
}: {
  params: { manage: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const fetchDataMap: Record<string, { fetch: () => Promise<any>; type: any }> = {
    employee: { fetch: getAllEmployees, type: "employees" },
    organization: { fetch: getAllDepartments, type: "organizations" },
    domain: { fetch: getAlldomain, type: "domains" },
    branch: { fetch: getAllBranch, type: "branchs" },
    manager: { fetch: getAllManager, type: "managers" },
    job: { fetch: getAllJob, type: "jobs" },
  };

  const { fetch, type } = fetchDataMap[params.manage] || {};
  const res = fetch ? await fetch() : null;
  const data = res ? res[type] : [];
  return (
    <div className="min-h-fill bg-white flex flex-col overflow-y-visible">
      {data ? (<StartEditButtonGrid data={data || []} type={type} />) : <PageNotAvailable/> }
    </div>
  );
}
