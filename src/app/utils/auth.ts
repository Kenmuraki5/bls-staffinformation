'use server'

import { cookies } from "next/headers";

export async function getToken(name: string): Promise<string> {
  const cookie = cookies().get(name);
  return cookie?.value ?? '';
}

export async function setToken(name: string, value: string): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(name, value, { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
}

export async function base64Decode(str: string): Promise<string> {
  return Buffer.from(str, 'base64').toString('utf8');
}

export async function parseJwt(token: string): Promise<any> {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = await base64Decode(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    // console.error('Failed to parse JWT', e);
    return null;
  }
}

export async function getRole(): Promise<string | null> {
  try {
    const token = await getToken("auth_token");
    const data = await parseJwt(token);
    return 'AdminStaffInformation'
    // return data?.roles?.[0] || null; // Handle cases where roles might not be defined
  } catch (error) {
    console.error('Failed to get role', error);
    return null;
  }
}