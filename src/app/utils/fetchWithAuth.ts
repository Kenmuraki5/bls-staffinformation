'use server'
import { getToken, setToken } from './auth';
import { redirect } from 'next/navigation';

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

async function fetchWithAuth(url: string, options: FetchOptions = {}): Promise<Response> {
  let token = await getToken("auth_token");

  let response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 500) {
    const refreshToken = await getToken("refresh_token");

    if (refreshToken) {
      const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (refreshResponse.ok) {
        const refreshedTokens = await refreshResponse.json();

        await setToken("auth_token", refreshedTokens.access_token);
        await setToken("refresh_token", refreshedTokens.refresh_token);

        token = refreshedTokens.access_token;
        response = await fetch(url, {
          ...options,
          headers: {
            'Authorization': `Bearer ${token}`,
            ...options.headers,
          },
        });
      } else {
        console.error("Failed to refresh token. Redirecting to login.");
        redirect(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`);
      }
    } else {
      console.error("No refresh token available. Redirecting to login.");
      redirect(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`);
    }
  }

  return response;
}

export default fetchWithAuth;
