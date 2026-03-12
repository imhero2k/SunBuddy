import { auth } from "./firebase";

export async function apiFetch(input: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(input, { ...init, headers });
}

