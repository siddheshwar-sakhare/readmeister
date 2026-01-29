import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user2`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);


  
  const logout = () => {
    window.location.href =`${import.meta.env.VITE_BACKEND_URL}/logout`;
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="bg-white p-8 rounded-xl shadow">
      <div className="flex items-center gap-6">
        <img
          src={user.avatarUrl}
          alt="profile"
          className="w-24 h-24 rounded-full"
        />

        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">@{user.username}</p>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <button
        onClick={logout}
        className="mt-8 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
