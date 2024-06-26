'use server'

import { cookies } from "next/headers";

export async function getToken(name: string) {
  return cookies().get(name)?.value ?? '';
}

function base64Decode(str: string) {
  return Buffer.from(str, 'base64').toString('utf8');
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = base64Decode(base64);
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export async function getRole(){
  try {
    const token = await getToken("session");
    const data = parseJwt(token);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function login(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const res = await fetch("http://localhost:8082/authpb.AuthService/Login", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(`Login failed: ${result.message}`);
    }

    const oneDay = 24 * 60 * 60 * 1000
    cookies().set('session', result.token, { expires: Date.now() + oneDay });
    return;
  } catch (error: any) {
    console.error("Error during login:", error.message);
    return;
  }
}


export async function logout() {
  try {
    cookies().delete('session')
  } catch (error) {
    console.log(error)
  }
}