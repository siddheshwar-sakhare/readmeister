import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if GitHub redirected back with token as query param
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Save token in localStorage (or sessionStorage)
      localStorage.setItem("githubToken", token);

      // Mark user as logged in (state or context)
      // e.g., you can use a context or prop to update isLoggedIn

      // Navigate to home page
      navigate("/home");
    }
  }, [navigate]);

  const handleGitHubLogin = () => {
    // Redirect to Spring Boot backend for GitHub OAuth
    window.location.href = "http://localhost:1001/oauth2/authorization/github";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl mb-6">Welcome to ReadMeister</h1>
      <button
        onClick={handleGitHubLogin}
        className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          {/* GitHub logo path */}
          <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.753-1.333-1.753-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.832 2.807 1.303 3.492.997.108-.775.42-1.303.763-1.603-2.665-.3-5.466-1.333-5.466-5.932 0-1.31.468-2.38 1.235-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.47 11.47 0 013.003-.404c1.018.005 2.045.137 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.803 5.628-5.475 5.922.43.37.815 1.096.815 2.21 0 1.595-.015 2.882-.015 3.273 0 .32.218.694.825.576C20.565 22.3 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
        </svg>
        Continue with GitHub
      </button>
    </div>
  );
};

export default SignIn;
