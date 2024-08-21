
import { redirect } from 'next/navigation';
import fetchWithAuth from '../utils/fetchWithAuth';
import fetchWithAuthClient from '../utils/fetchWithAuthClientSide';

export async function getEmployeesByOrgID(domainID: string | string[] | undefined, orgID: string | string[] | undefined) {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/employee/id/employeeOrg/${domainID}/${orgID}`;
    const res = await fetchWithAuth(url);

    if (!res.ok) {
      throw new Error('Failed to fetch employees');
    }

    return await res.json();
  } catch (error:any) {
    if (error.message == "Unauthorized"){
      redirect("http://localhost:8082/login")
    }
    console.error('Error fetching employees:', error);
    return [];
  }
}

export async function getAllEmployees() {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/employee`;
    const res = await fetchWithAuth(url);
    
    if (!res.ok) {
      throw new Error('Failed to fetch employees');
    }
    
    return await res.json();
  } catch (error:any) {
    if (error.message == "Unauthorized"){
      redirect("http://localhost:8082/login")
    }
    console.error('Error fetching employees:', error);
    return [];
  }
}

export async function getAllEmployeesClientSide() {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/employee`;
    const res = await fetchWithAuthClient(url);
    
    if (!res.ok) {
      throw new Error('Failed to fetch employees');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
}
