import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardContent() {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [recentRepos, setRecentRepos] = useState([]);
  const navigate = useNavigate();

  // Load recent repos from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentRepos");
    if (stored) setRecentRepos(JSON.parse(stored));
  }, []);

  // Fetch user's GitHub repos
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/github/repos`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRepos(data);
          if (data.length > 0 && !selectedRepo) setSelectedRepo(data[0]);
        }
      })
      .catch(console.error);
  }, []);

  const handleOpenRepo = () => {
    if (!selectedRepo) return;

    setRecentRepos((prev) => {
      const filtered = prev.filter((r) => r.id !== selectedRepo.id);
      const updated = [selectedRepo, ...filtered].slice(0, 5); // max 5
      localStorage.setItem("recentRepos", JSON.stringify(updated));
      return updated;
    });

    navigate("/home", { state: { repoFullName: selectedRepo.full_name } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 px-4 ">
      {/* Selection Row */}
      <div className="bg-white p-5 rounded-2xl shadow-md w-full max-w-4xl flex flex-col md:flex-row items-center gap-4">
        <select
          value={selectedRepo?.full_name || ""}
          onChange={(e) =>
            setSelectedRepo(repos.find((r) => r.full_name === e.target.value))
          }
          className="flex-1 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 text-lg"
        >
          {repos.map((repo) => (
            <option key={repo.id} value={repo.full_name}>
              {repo.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleOpenRepo}
          className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 text-lg font-semibold transition"
          disabled={!selectedRepo}
        >
          Open
        </button>
      </div>

      {/* Recent Repositories */}
      {recentRepos.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Recently Opened Repositories
          </h3>
          <ul className="flex flex-col gap-3">
            {recentRepos.map((repo) => (
              <li
                key={repo.id}
                className="bg-white p-4 rounded-xl shadow hover:bg-purple-50 cursor-pointer transition"
                onClick={() =>
                  navigate("/home", { state: { repoFullName: repo.full_name } })
                }
              >
                <h4 className="font-semibold text-gray-900">{repo.name}</h4>
                <p className="text-gray-600 text-sm truncate">
                  {repo.description || "No description"}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Last updated:{" "}
                  {repo.updated_at
                    ? new Date(repo.updated_at).toLocaleString()
                    : "N/A"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
