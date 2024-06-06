'use server'

import { getToken } from "./action";

export default async function handleSearch(searchBy: string, searchInput: string, domain: string) {
    console.log(searchBy, searchInput, domain)
    // const token = await getToken("session")
    // const url = `http://localhost:8080/${searchBy}/${domain}?org_unit=${searchInput}`;
    // try {
    //     const response = await fetch(url, {headers:{'authorization': token}});
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     const data = await response.json();
    //     return data || [];
    // } catch (error) {
    //     console.error('Error fetching data:', error);
    // }
};