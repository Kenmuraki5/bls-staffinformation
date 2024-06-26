import { getToken } from "./action";

export async function getAllJob() {
    try {
      const token = await getToken("session")
      const res = await fetch(`http://localhost:8080/staffinformation/job`, {
        headers: { 'authorization': token }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      return await res.json();
    } catch (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  };