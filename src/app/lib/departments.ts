'use server'

export default async function getDepartments(domainID: string | string[] | undefined | null) {
  if (domainID == undefined) {
    domainID = "BLS"
  }
  try {
    const res = await fetch(`http://localhost:8081/organizations/${domainID}`);
    if (!res.ok) {
      throw new Error('Failed to fetch departments');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};