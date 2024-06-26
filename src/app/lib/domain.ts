import { getToken } from "./action";

export async function getAlldomain() {
    try {
      const token = await getToken("session")
      const res = await fetch(`http://localhost:8081/staffinformation/domains`, {
        headers: { 'authorization': token }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch domain');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching domain:', error);
      return [];
    }
  };
  