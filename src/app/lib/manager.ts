import { getToken } from "./action";

export async function getAllManager() {
    try {
      const token = await getToken("session")
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_BASEURL}:8081/staffinformation/managers`, {
        headers: { 'authorization': token }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch manager');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching manager:', error);
      return [];
    }
  };
  