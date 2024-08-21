import { redirect } from 'next/navigation';
import fetchWithAuth from '../utils/fetchWithAuth';
import fetchWithAuthClient from '../utils/fetchWithAuthClientSide';

export async function getAlldomain() {
  try {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/domains`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch domain');
    }
    
    return await res.json();
  } catch (error:any) {
    if (error.message == "Unauthorized"){
      redirect(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`)
    }
    console.error('Error fetching domain:', error);
    return [];
  }
}

export async function getAlldomainClientSide() {
  try {
    const res = await fetchWithAuthClient(`${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/domains`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch domain');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching domain:', error);
    return [];
  }
}
