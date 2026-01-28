import { Github, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onNavigate, isLoggedIn = false, githubUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // fetch("http://localhost:1001/logout", {
    //   method: "POST",
    //   credentials: "include",
    // }).finally(() => navigate("/"));
    navigate("/dashboard");
  };
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50  py-6 mt-4">
      <div className="container w-full h-16 px-4">
        <div className="mx-auto max-w-7xl flex h-16 items-center rounded-full shadow-md border bg-white dark:bg-background dark:border-white/50 px-6">
          
          {/* Logo */}
          <button
            onClick={() => onNavigate("landing")}
            className="text-xl font-semibold text-gray-900 hover:text-purple-600 transition"
          >
            ReadMeister
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4 ml-auto">
            {isLoggedIn ? (
              <>
                {/* GitHub username and icon */}
                <div className="flex items-center gap-2 text-gray-700">
                  <Github size={20} />
                  <span>{githubUser || "GitHub User"}</span>
                </div>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </button>

                {/* Logout button */}
                {/* <button
  onClick={handleLogout}
  className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
>
  ← Logout
</button> */}
              </>
            ) : (
              <>
                <button
  onClick={() => {
    document.getElementById("features")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
  className="text-gray-600 hover:text-gray-900"
>
  Features
</button>

{/* 
                <button
                  onClick={() => onNavigate("how-it-works")}
                  className="text-gray-600 hover:text-gray-900"
                >
                  How it Works
                </button> */}
            <button
  onClick={() => {
    document.getElementById("faq")?.scrollIntoView({
      behavior: "smooth",
    });
  }}
  className="text-gray-600 hover:text-gray-900"
>
  FAQ`s`
</button>

                <button
                  onClick={() => navigate("/signin")}
                  className="bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                >
                  <Github size={18} />
                  Sign in with GitHub
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden ml-auto">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Menu className="h-6 w-6" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
