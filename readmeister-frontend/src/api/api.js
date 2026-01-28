// api.js
export async function fetchUser(token) {
  const res = await fetch("http://localhost:1001/api/user/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Invalid token");
  return res.json();
}
