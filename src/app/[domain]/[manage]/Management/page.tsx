import * as React from 'react';
import PersistentDrawerLeft from '@/components/drawer';
import { getAllEmployees } from '../../../lib/employees';
import { StartEditButtonGrid } from '@/components/admin';
import { getAllDepartments } from '@/app/lib/departments';
import { getAlldomain } from '@/app/lib/domain';
import { getAllBranch } from '@/app/lib/branch';
import { getAllManager } from '@/app/lib/manager';

export default async function AdminEmployeeManagement({
  params,
  searchParams,
}: {
  params: { manage: string, domain: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  var data;
  var type: any;
  if (params?.manage == "employee") {
    const res = await getAllEmployees();
    data = res.employees;
    type = "emp";
  } else if (params.manage == "organization") {
    const res = await getAllDepartments(params?.domain);
    data = res.organizations
    type = "org";
  } else if (params.manage == "domain") {
    const res = await getAlldomain();
    data = res.domains
    type = "domain";
  } else if (params.manage == "branch") {
    const res = await getAllBranch();
    data = res.branchs
    type = "branch";
  } else if (params.manage == "manager") {
    const res = await getAllManager();
    data = res.managers
    type = "manager";
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PersistentDrawerLeft />
      <StartEditButtonGrid data={data || []} type={type} />
    </div>
  );
}