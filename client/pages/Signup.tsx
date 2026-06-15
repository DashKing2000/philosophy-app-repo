import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";

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

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (pwd: string) => {
    const checks = {
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      length: pwd.length >= 8,
    };
    return checks;
  };

  const passwordChecks = validatePassword(password);
  const isPasswordValid =
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number &&
    passwordChecks.special &&
    passwordChecks.length;

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!fullName || !username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      setError("Username must be 3-20 characters (letters, numbers, underscores only)");
      return;
    }

    if (!isPasswordValid) {
      setError("Password does not meet all requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u: any) => u.email === email)) {
      setError("Email already registered. Please log in instead.");
      return;
    }

    if (users.find((u: any) => u.username === username)) {
      setError("Username already taken. Please choose another.");
      return;
    }

    // Move to confirmation step
    setStep("confirm");
  };

  const handleSignup = async () => {
    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      const newUser = {
        id: Date.now().toString(),
        fullName,
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // Auto-login
      localStorage.setItem("currentUser", JSON.stringify({ email: newUser.email, id: newUser.id, username: newUser.username }));
      sessionStorage.setItem("authToken", `token_${newUser.id}`);

      setIsLoading(false);
      navigate("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setIsLoading(true);

    try {
      const googleEmail = "user+" + Math.random().toString(36).substring(7) + "@gmail.com";
      const googleId = "google_" + Date.now().toString();
      const googleUsername = "user_" + Math.random().toString(36).substring(7);

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      let user = users.find((u: any) => u.email === googleEmail);

      if (!user) {
        user = {
          id: googleId,
          fullName: "Google User",
          username: googleUsername,
          email: googleEmail,
          password: "google_oauth",
          loginMethod: "google",
          createdAt: new Date().toISOString(),
        };
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
      }

      localStorage.setItem("currentUser", JSON.stringify({ email: user.email, id: user.id, username: user.username }));
      sessionStorage.setItem("authToken", `token_${user.id}`);

      setIsLoading(false);
      navigate("/");
    } catch (err) {
      setError("Failed to sign up with Google. Please try again.");
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

        {/* Signup Form */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {step === "form" ? "Create Account" : "Confirm Your Details"}
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {step === "form" ? (
            <form onSubmit={handleContinue} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="john_doe"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">3-20 characters (letters, numbers, underscores)</p>
              </div>

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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Password must contain:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      {passwordChecks.uppercase ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={passwordChecks.uppercase ? "text-green-600 font-medium" : "text-gray-600"}>
                        At least one uppercase letter (A-Z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordChecks.lowercase ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={passwordChecks.lowercase ? "text-green-600 font-medium" : "text-gray-600"}>
                        At least one lowercase letter (a-z)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordChecks.number ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={passwordChecks.number ? "text-green-600 font-medium" : "text-gray-600"}>
                        At least one number (0-9)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordChecks.special ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={passwordChecks.special ? "text-green-600 font-medium" : "text-gray-600"}>
                        At least one special character (!@#$%^&* etc)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {passwordChecks.length ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className={passwordChecks.length ? "text-green-600 font-medium" : "text-gray-600"}>
                        At least 8 characters long
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && confirmPassword && password === confirmPassword && (
                  <p className="text-xs text-green-600 font-medium mt-1">✓ Passwords match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isPasswordValid || password !== confirmPassword}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg mt-6"
              >
                {isLoading ? "Creating Account..." : "Continue"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Confirmation Summary */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-600 font-medium">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900">{fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Username</p>
                  <p className="text-lg font-semibold text-gray-900">@{username}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{email}</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center">
                Please review your information above. Once you confirm, your account will be created.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setStep("form")}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isLoading ? "Confirming..." : "Confirm & Sign Up"}
                </button>
              </div>
            </div>
          )}

          {step === "form" && (
            <>
              {/* Divider */}
              <div className="flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gray-200"></div>
                <p className="text-gray-500 text-sm font-medium">OR</p>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              {/* Google Signup Button */}
              <button
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-gray-200 text-gray-900 font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GoogleIcon />
                {isLoading ? "Signing up..." : "Sign up with Google"}
              </button>
            </>
          )}
        </div>

        {step === "form" && (
          <div className="text-center">
            <p className="text-gray-600 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Log In
              </Link>
            </p>
          </div>
        )}

        {/* Terms Info */}
        {step === "form" && (
          <div className="text-center text-xs text-gray-600 mt-6">
            <p>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
