import { redirect } from 'next/navigation';
import fetchWithAuth from '../utils/fetchWithAuth';

export async function getAllCorporations() {
  try {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/corporationTitle`);
    if (!res.ok) {
      throw new Error('Failed to fetch branch');
    }
    return await res.json();
  } catch (error:any) {
    if (error.message == "Unauthorized"){
      redirect(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`)
    }
    console.error('Error fetching branch:', error);
    return [];
  }
}
