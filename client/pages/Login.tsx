import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Mail, Lock, AlertCircle, ArrowLeft } from "lucide-react";

// Google icon SVG component
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.745 12.27c0-.79-.1-1.54-.25-2.25H12v4.26h6.066c-.27 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 24c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 22.29 7.7 24 12 24z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 2.71 2.18 5.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simple validation
    if (!email || !password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (!user) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Store current user session
      localStorage.setItem("currentUser", JSON.stringify({ email: user.email, id: user.id }));
      sessionStorage.setItem("authToken", `token_${user.id}`);

      setIsLoading(false);
      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      // Check if user exists with this email
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // For demo: simulate receiving Google email from OAuth
      const googleEmail = sessionStorage.getItem("googleEmail");

      if (googleEmail) {
        // User came from signup with Google, check if they exist
        const existingUser = users.find((u: any) => u.email === googleEmail);

        if (existingUser) {
          // User already exists, log them in
          localStorage.setItem("currentUser", JSON.stringify({ email: existingUser.email, id: existingUser.id, username: existingUser.username }));
          sessionStorage.setItem("authToken", `token_${existingUser.id}`);
          sessionStorage.removeItem("googleEmail");
          navigate("/");
        } else {
          // New user, redirect to signup
          navigate("/signup");
        }
      } else {
        // Regular Google login - generate email
        const newEmail = "user+" + Math.random().toString(36).substring(7) + "@gmail.com";
        const existingUser = users.find((u: any) => u.email === newEmail);

        if (existingUser) {
          // Log in existing user
          localStorage.setItem("currentUser", JSON.stringify({ email: existingUser.email, id: existingUser.id, username: existingUser.username }));
          sessionStorage.setItem("authToken", `token_${existingUser.id}`);
          navigate("/");
        } else {
          // Store the Google email in session and redirect to signup
          sessionStorage.setItem("googleEmail", newEmail);
          navigate("/signup");
        }
      }

      setIsLoading(false);
    } catch (err) {
      setError("Failed to login with Google. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </Link>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Philosophy <span className="text-blue-600">CBT</span>
            </h1>
          </div>
          <p className="text-gray-600">Master your philosophy studies</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Log In
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-200"></div>
            <p className="text-gray-500 text-sm font-medium">OR</p>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-200 text-gray-900 font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            {isLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600 font-medium">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Demo Account:</strong>
          </p>
          <p className="text-xs text-gray-600">
            Email: <code className="bg-white px-2 py-1 rounded">demo@example.com</code>
          </p>
          <p className="text-xs text-gray-600">
            Password: <code className="bg-white px-2 py-1 rounded">demo123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
