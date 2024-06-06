'use server'

import { cookies } from "next/headers";

export async function getToken(name: string) {
  return cookies().get(name)?.value ?? '';
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