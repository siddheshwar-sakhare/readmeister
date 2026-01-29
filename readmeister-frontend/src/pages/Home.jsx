import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

import { Download } from "lucide-react";

const HomeWithReadme = () => {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [readme, setReadme] = useState("");
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingReadme, setLoadingReadme] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [savedText, setSavedText] = useState(""); // for Save button

  const navigate = useNavigate();

  const handleNavigate = (section) => {
    if (section === "landing") navigate("/");
    if (section === "dashboard") navigate("/home");
    if (section === "features") navigate("/features");
    if (section === "how-it-works") navigate("/how-it-works");
  };

const [userData, setUserData] = useState({});

const location = useLocation();

useEffect(() => {
  if (location.state?.repoFullName) {
    setSelectedRepo(location.state.repoFullName);
  }
}, [location.state])

useEffect(() => {
  fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
    credentials: "include"
  })
    .then(res => {
      if (res.status === 401) return null; // not logged in
      return res.json();
    })
    .then(data => {
      if (data) setUserData(data);
    })
    .catch(err => console.error(err));
}, []);




  // Fetch user repos
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/github/repos`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) navigate("/signin");
        return res.json();
      })
      .then((data) => {
        if (data) setRepos(data);
        setLoadingRepos(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingRepos(false);
      });
  }, [navigate]);

  // Fetch README for selected repo
  useEffect(() => {
    if (!selectedRepo) return;

    setLoadingReadme(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/github/repos/${selectedRepo}/readme`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch README");
        return res.text();
      })
      .then((data) => setReadme(data))
      .catch((err) => console.error(err))
      .finally(() => setLoadingReadme(false));
  }, [selectedRepo]);

  // Push to GitHub
  const handlePush = () => {
    if (!selectedRepo) return;
    setSaving(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/github/repos/${selectedRepo}/readme/push`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: "README.md",
        message: "Updated README",
        content: readme,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to push README");
        return res.json();
      })
      .then((data) => {
        console.log("GitHub response:", data);
        alert("README pushed to GitHub!");
      })
      .catch((err) => {
        console.error(err);
        alert("Error pushing README");
      })
      .finally(() => setSaving(false));
  };

  // Generate AI content
  const handleGenerateAI = () => {
    if (!selectedRepo) return;
    setGenerating(true);

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/github/repos/${selectedRepo}/generate`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to generate README");
        return res.text();
      })
      .then((generated) => setReadme(generated))
      .catch((err) => {
        console.error(err);
        alert("Error generating README");
      })
      .finally(() => setGenerating(false));
  };
// Download README as .md file
const handleDownload = () => {
  if (!readme) return;

  const blob = new Blob([readme], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${selectedRepo?.split("/")[1] || "README"}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

  return (
    <>
  <Navbar
    isLoggedIn={!!userData?.login}
    githubUser={userData?.login}
    onNavigate={handleNavigate}
  />

  <section className="relative min-h-screen w-full overflow-x-hidden pt-24">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50" />
    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl" />
    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />

    {/* Content */}
    {/* <div className="relative z-10 flex justify-center px-4 py-10"> */}
    <div className="relative z-10 px-4 py-10">

   <div className="w-full max-w-[110rem] mx-auto bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8">



        {/* Top Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex gap-3">
            <button
              className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition disabled:opacity-50"
              onClick={handlePush}
              disabled={saving || !selectedRepo}
            >
              {saving ? "Pushing..." : "Push to GitHub"}
            </button>

            <button
              className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
              onClick={handleGenerateAI}
              disabled={generating || !selectedRepo}
            >
              {generating ? "Generating..." : "Generate by AI"}
            </button>
            
          </div>
  <div className="flex gap-3 items-center">
    <button
      className=" text-gray-1000 px-5 py-2 rounded-xl hover:text-blue-700 transition disabled:opacity-50 flex items-center gap-2"
      onClick={handleDownload}
      disabled={!readme}
    >
       <Download size={18} />
      Download 
    </button>

          {loadingRepos ? (
            <p className="text-gray-500">Loading repositories...</p>
          ) : (
            <select
              className="w-72 p-3 rounded-xl border focus:ring-2 focus:ring-purple-500"
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
            >
              <option value="">— Select Repository —</option>
              {repos.map((repo) => (
                <option key={repo.id} value={repo.full_name}>
                  {repo.name}
                </option>
              ))}
            </select>
          )}
        </div>
</div>
        {selectedRepo && loadingReadme && (
          <p className="text-center text-gray-500 animate-pulse">
            Loading README...
          </p>
        )}

        {selectedRepo && !loadingReadme && (
          <div className="flex flex-col md:flex-row gap-6">
            <textarea
              className="w-full md:w-1/2 h-[600px] p-4 rounded-2xl border font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-purple-500"
              value={readme}
              onChange={(e) => setReadme(e.target.value)}
            />

            <div className="w-full md:w-1/2 h-[600px] rounded-2xl border bg-white shadow-sm flex flex-col overflow-hidden">
              <div className="flex justify-end p-3 border-b bg-gray-50">
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700"
                  onClick={() => setSavedText(readme)}
                >
                  Save Preview
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4 prose max-w-none">
                <ReactMarkdown>{savedText || readme}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
  <button
  onClick={() => navigate("/dashboard")}
  className="fixed bottom-6 left-6 bg-purple-500 text-white px-5 py-3 rounded-lg shadow-lg hover:bg-red-600 hover:shadow-xl transition flex items-center gap-2 z-50"
>
  ← Back
</button>
</>

  );
};

export default HomeWithReadme;
