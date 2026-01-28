import { FileText, User } from "lucide-react";

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-purple-600 mb-10">
        ReadMeister
      </h2>

      <nav className="space-y-4">
        <button   onClick={() => setActive("repos")}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 font-medium  hover:bg-purple-200
          ${active === "repos" ? "bg-purple-200 font-semibold" : "hover:bg-gray-100"}`}>
          <FileText size={20} />
          Generate README
        </button>

        <button onClick={() => setActive("profile")}
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-purple-200
        ${active === "profile" ? "bg-purple-200 font-semibold" : "hover:bg-gray-100"}`}
        >
          <User size={20} />
          Profile
        </button>
      </nav>
    </aside>
  );
}
