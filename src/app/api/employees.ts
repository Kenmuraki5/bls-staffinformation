
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
      redirect(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`)
    }
    // console.error('Error fetching employees:', error);
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
      redirect(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`)
    }
    // console.error('Error fetching employees:', error);
    return [];
  }
}

export async function getAllEmployeesClientSide() {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASEURL_CLIENT_SIDE}/staffinformation/employee`;
    const res = await fetchWithAuthClient(url);
    
    if (!res.ok) {
      throw new Error('Failed to fetch employees');
    }
    
    return await res.json();
  } catch (error) {
    // console.error('Error fetching employees:', error);
    return [];
  }
}

export async function getEmployee(domainId: string, empId: string) {
    try {
        const url = `${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/employee/${domainId}/${empId}`;
        const response = await fetchWithAuth(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch employee');
        }
        return await response.json();
    } catch (error) {
        // console.error('Error fetching employee:', error);
        return null;
    }
}