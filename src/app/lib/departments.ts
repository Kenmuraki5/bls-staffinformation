'use server'

export async function getAllDepartments(domainID: string | string[] | undefined | null) {
  if (domainID == undefined) {
    domainID = "BLS"
  }
  try {
    const res = await fetch(`http://localhost:8081/staffinformation/organizations`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch departments');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
}

export async function getAllDepartmentsHeirachy(domainID: string | string[] | undefined | null) {
  if (domainID == undefined) {
    domainID = "BLS"
  }
  try {
    const res = await fetch(`http://localhost:8081/staffinformation/organizations/heirachy/${domainID}`,  { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error('Failed to fetch departments');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
};
