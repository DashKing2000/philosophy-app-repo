import { Link } from "react-router-dom";
import { BookOpen, BarChart3, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser");
  const user = currentUser ? JSON.parse(currentUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("authToken");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg text-gray-900">Philosophy CBT</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, <strong>{user.email}</strong>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              Philosophy <span className="text-blue-600">CBT</span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Master your philosophy studies with our comprehensive computer-based practice system. 
            Practice with 900+ questions across all 15 philosophy topics, get instant feedback, and track your progress.
          </p>

          {user ? (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Practice
              </Link>
              <Link
                to="/history"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-lg text-lg"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View History
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Learning Now
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors shadow-lg text-lg"
              >
                Create Free Account
              </Link>
            </div>
          )}
        </div>

        {/* Key Stats */}
        <div className="bg-white rounded-lg shadow-lg p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Philosophy CBT?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Comprehensive Coverage
                </h3>
                <p className="text-gray-600">
                  All 15 philosophy study sessions with detailed topic coverage
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Intelligent Analytics
                </h3>
                <p className="text-gray-600">
                  Track your progress with detailed history and performance metrics
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Flexible Learning
                </h3>
                <p className="text-gray-600">
                  Customize question count, time limits, and topics to your needs
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-600 text-white font-bold">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Detailed Review
                </h3>
                <p className="text-gray-600">
                  Review your answers with explanations for better learning
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            🎓 Designed for philosophy students preparing for examinations and mastering concepts
          </p>
        </div>
      </div>
    </div>
  );
}
