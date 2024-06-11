'use server'

import { getToken } from "./action";

export default async function handleSearch(searchBy: string, searchInput: string, domain: string) {
    console.log(searchBy, searchInput, domain)
    const searchParam = searchBy == "employeeId" ? "emp_id" : searchBy == "employeeName" ? "emp_name" : searchBy == "organizationUnit" ? "org_unit" : null;
    const token = await getToken("session")
    const url = `http://127.0.0.1:8080/staffinformation/employee/${searchBy}/${domain}?${searchParam}=${searchInput}`;
    try {
        const response = await fetch(url, {headers:{'authorization': token}});
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("search : ", data)
        return data || null;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};