import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import RecentRepos from "../components/DashboardContent.jsx";
import Profile from "./Profile.jsx";


export default function Dashboard() {
  const [active, setActive] = useState("repos");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar active={active} setActive={setActive} />

      <div className="flex-1 p-8">
        {active === "repos" && <RecentRepos />}
        {active === "profile" && <Profile />}
      </div>
    </div>
  );
}
