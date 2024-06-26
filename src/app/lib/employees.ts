'use server'

import { getToken } from "./action";

export async function getEmployeesByOrgID(domainID: string | string[] | undefined, orgID: string | string[] | undefined) {
  try {
    const token = await getToken("session")
    const res = await fetch(`http://localhost:8080/staffinformation/employee/id/employeeOrg/${domainID}/${orgID}`, {
      headers: { 'authorization': token }
    });
    if (!res.ok) {
      throw new Error('Failed to fetch employees');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};

export async function getAllEmployees() {
  try {
    const token = await getToken("session")
    const res = await fetch(`http://localhost:8080/staffinformation/employee`, {
      headers: { 'authorization': token },
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error('Failed to fetch employees');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
};
