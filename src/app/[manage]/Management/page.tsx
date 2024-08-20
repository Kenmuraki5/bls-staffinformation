import * as React from 'react';
import PersistentDrawerLeft from '@/components/drawer';
import { getAllEmployees } from '../../api/employees';
import { StartEditButtonGrid } from '@/components/admin';
import { getAllDepartments } from '@/app/api/departments';
import { getAlldomain } from '@/app/api/domain';
import { getAllBranch } from '@/app/api/branch';
import { getAllManager } from '@/app/api/manager';
import { getAllJob } from '@/app/api/job';

export default async function AdminEmployeeManagement({
  params,
  searchParams,
}: {
  params: { manage: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const fetchDataMap: Record<string, { fetch: () => Promise<any>; type: any }> = {
    employee: { fetch: getAllEmployees, type: "emp" },
    organization: { fetch: getAllDepartments, type: "org" },
    domain: { fetch: getAlldomain, type: "domain" },
    branch: { fetch: getAllBranch, type: "branch" },
    manager: { fetch: getAllManager, type: "manager" },
    job: { fetch: getAllJob, type: "job" },
  };

  const { fetch, type } = fetchDataMap[params.manage] || {};
  const res = fetch ? await fetch() : null;
  const data = res ? res[type + (type === "emp" ? "loyees" : "s")] : [];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PersistentDrawerLeft />
      <StartEditButtonGrid data={data || []} type={type} />
    </div>
  );
}
