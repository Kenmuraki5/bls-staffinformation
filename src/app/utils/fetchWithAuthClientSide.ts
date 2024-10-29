'use client'

import { getToken } from "./auth";

export default async function fetchWithAuthClient(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getToken("auth_token");

  let response = await fetch(url, {
    ...options,
    // headers: {
    //   'Authorization': `Bearer ${token}`,
    //   ...options.headers,
    // },
  });

  if (response.status === 403) {
    console.error("Authentication failed or server error. Redirecting to login.");
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/login`;
  }

  return response;
}
