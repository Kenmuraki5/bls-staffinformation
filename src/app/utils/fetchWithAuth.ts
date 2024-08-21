import { getToken } from './auth';

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export default async function fetchWithAuth(url: string, options: FetchOptions = {}): Promise<Response> {
  const token = await getToken('auth_token');

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 500) {
    throw new Error('Unauthorized');
  }

  return response;
}
