'use server'

import { getToken } from "./action";

export default async function getEmployees(domainID: string | string[] | undefined, orgID: string | string[] | undefined) {
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