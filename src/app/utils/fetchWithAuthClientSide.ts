'use client'

import { getToken } from "./auth";

export default async function fetchWithAuthClient(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getToken("auth_token");

  let response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 500) {
    // เปลี่ยนเส้นทางไปยังหน้า login เมื่อ token หมดอายุ
    console.error("Authentication failed or server error. Redirecting to login.");
    window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/login`;
  }

  return response;
}

// export function setToken(name: string, value: string): void {
//   Cookies.set(name, value, { expires: 7, path: '/' }); // example expiry
// }

// export default async function fetchWithAuthClient(url: string, options: RequestInit = {}): Promise<Response> {
//   let token = getToken("auth_token");

//   let response = await fetch(url, {
//     ...options,
//     headers: {
//       'Authorization': `Bearer ${token}`,
//       ...options.headers,
//     },
//   });

//   if (response.status === 401 || response.status === 500) {
//     const refreshToken = getToken("refresh_token");

//     if (refreshToken) {
//       const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/refresh-token`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ refresh_token: refreshToken }),
//       });

//       if (refreshResponse.ok) {
//         const refreshedTokens = await refreshResponse.json();

//         setToken("auth_token", refreshedTokens.access_token);
//         setToken("refresh_token", refreshedTokens.refresh_token);

//         token = refreshedTokens.access_token;
//         response = await fetch(url, {
//           ...options,
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             ...options.headers,
//           },
//         });
//       } else {
//         console.error("Failed to refresh token. Redirecting to login.");
//         window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/login`;
//       }
//     } else {
//       console.error("No refresh token available. Redirecting to login.");
//       window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/login`;
//     }
//   }

//   return response;
// }
