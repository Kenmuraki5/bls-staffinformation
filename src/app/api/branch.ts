import fetchWithAuth from '../utils/fetchWithAuth';

export async function getAllBranch() {
  try {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/branch`);
    if (!res.ok) {
      throw new Error('Failed to fetch branch');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching branch:', error);
    return [];
  }
}
