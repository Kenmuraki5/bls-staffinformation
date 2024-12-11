import { redirect } from 'next/navigation';
import fetchWithAuth from '../utils/fetchWithAuth';
import fetchWithAuthClient from '../utils/fetchWithAuthClientSide';

export async function getAllJob() {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/job`;
    const res = await fetchWithAuth(url);
    
    if (!res.ok) {
      throw new Error('Failed to fetch jobs');
    }
    
    return await res.json();
  } catch (error:any) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function getAllJobClientSide() {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/job`;
    const res = await fetchWithAuthClient(url);
    
    if (!res.ok) {
      throw new Error('Failed to fetch jobs');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}