import { redirect } from 'next/navigation';
import fetchWithAuth from '../utils/fetchWithAuth'; // Server-side
import fetchWithAuthClient from '../utils/fetchWithAuthClientSide';

export async function getAllDepartments() {
  try {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/organizations`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch departments');
    }
    const data = await res.json();
    return data;
  } catch (error:any) {
    if (error.message == "Unauthorized"){
      redirect(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`)
    }
    console.error('Error fetching departments:', error);
    return { organizations: [] };
  }
}


export async function getAllDepartmentsClientSide() {
  try {
    const res = await fetchWithAuthClient(`${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/organizations`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch departments');
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    return { organizations: [] };
  }
}

export async function getAllDepartmentsHeirachy(domainID: string | string[] | undefined | null) {
  if (domainID === undefined) {
    domainID = "BLS";
  }

  try {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/organizations/hierachy/${domainID}`, {
      // next: { revalidate: 3600 },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch DepartmentsHeirachy');
    }
    return await res.json();
  } catch (error:any) {
    if (error.message == "Unauthorized"){
      redirect(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`)
    }
    console.error('Error fetching DepartmentsHeirachy:', error);
    return [];
  }
}
