'use server'

import { getToken } from "./action";

export async function getAllDepartments(domainID: string | string[] | undefined | null) {
  if (domainID == undefined) {
    domainID = "BLS"
  }
  try {
    const token = await getToken("session")
    const res = await fetch(`http://localhost:8081/staffinformation/organizations`, {
      headers: { 'authorization': token },
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error('Failed to fetch departments');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
}

export async function getAllDepartmentsHeirachy(domainID: string | string[] | undefined | null) {
  if (domainID == undefined) {
    domainID = "BLS"
  }
  try {
    const token = await getToken("session")
    const res = await fetch(`http://localhost:8081/staffinformation/organizations/hierachy/${domainID}`, { 
      headers: { 'authorization': token },
      next: { revalidate: 3600 } 
    });
    if (!res.ok) {
      throw new Error('Failed to fetch DepartmentsHeirachy');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching DepartmentsHeirachy:', error);
    return [];
  }
};
