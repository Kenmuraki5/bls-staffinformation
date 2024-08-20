'use server'

import fetchWithAuth from "../utils/fetchWithAuth";

export default async function handleSearch(searchBy: string, searchInput: string, domain: string) {
    console.log(searchBy, searchInput, domain);

    const searchParamMap: { [key: string]: string } = {
        employeeId: "emp_id",
        employeeName: "emp_name",
        organizationUnit: "org_unit",
        employeenickName: "emp_name"
    };

    const searchParam = searchParamMap[searchBy];

    if (!searchParam) {
        throw new Error(`Invalid searchBy parameter: ${searchBy}`);
    }

    const url = `${process.env.NEXT_PUBLIC_BASEURL}/staffinformation/employee/${searchBy}/${domain}?${searchParam}=${searchInput}`;

    try {
        const response = await fetchWithAuth(url);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${errorText}`);
        }

        const data = await response.json();
        console.log("search result:", data);
        return data || null;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}
