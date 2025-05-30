import { redirect } from 'next/navigation';
import fetchWithAuth from '../utils/fetchWithAuth';

export async function getAllManager() {
  try {
    const url = `${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/managers`;
    const res = await fetchWithAuth(url);

    if (!res.ok) {
      throw new Error('Failed to fetch manager');
    }

    return await res.json();
  } catch (error:any) {
    if (error.message == "Unauthorized"){
      redirect(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`)
    }
    console.error('Error fetching manager:', error);
    return [];
  }
}
