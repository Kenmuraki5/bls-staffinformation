import { getToken } from "./action";

export async function getAllBranch() {
    try {
      const token = await getToken("session")
      const res = await fetch(`http://${process.env.NEXT_PUBLIC_BASEURL}:8081/staffinformation/branch`, {
        headers: { 'authorization': token }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch branch');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching branch:', error);
      return [];
    }
};

// export async function updateBranch() {
//     try {
//         const rest = await t
//     } catch (error) {
        
//     }
// }
  