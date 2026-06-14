import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, BookOpen, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const SESSIONS = [
  "All Sessions (Complete Randomness)",
  "Session 1: Conception, Nature, Scope of Philosophy",
  "Session 2: Survey of the History of Philosophy",
  "Session 3: Metaphysics as a Branch of Philosophy",
  "Session 4: Epistemology as a Branch of Philosophy",
  "Session 5: Ethics and Aesthetics",
  "Session 6: Logic and Its Importance",
  "Session 7: Inference and Argument Types in Logic",
  "Session 8: Laws of Thought, Rules of Reasoning, Fallacies",
  "Session 9: The Philosophy of Other Disciplines",
  "Session 10: Socio-Political Philosophy",
  "Session 11: African Philosophy",
  "Session 12: Concept and Nature of Philosophy of Science",
  "Session 13: The History and Method of Science",
  "Session 14: Philosophy, Science and Technology",
  "Session 15: Philosophy and Its Relevance to Society",
];

export default function QuizSetup() {
  const navigate = useNavigate();
  const [session, setSession] = useState("all");
  const [numQuestions, setNumQuestions] = useState(20);
  const [timeLimit, setTimeLimit] = useState(30);
  const [completeRandom, setCompleteRandom] = useState(false);

  const handleToggleRandom = () => {
    const newRandom = !completeRandom;
    setCompleteRandom(newRandom);
    if (newRandom) {
      setSession("all");
      setNumQuestions(60);
      setTimeLimit(60);
    }
  };

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (numQuestions < 10 || numQuestions > 60) {
      alert("Number of questions must be between 10 and 60");
      return;
    }
    if (timeLimit < 5 || timeLimit > 120) {
      alert("Time limit must be between 5 and 120 minutes");
      return;
    }

    // Store quiz config
    const sessionNum = completeRandom ? "all" : (parseInt(session) || "all");
    sessionStorage.setItem(
      "quizConfig",
      JSON.stringify({
        session: sessionNum,
        numQuestions,
        timeLimit,
      })
    );

    navigate("/quiz/start");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg text-gray-900">Philosophy CBT</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">

        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          {/* Title */}
          <div className="flex items-center gap-3 mb-8">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Quiz Configuration</h1>
          </div>

          <form onSubmit={handleStartQuiz} className="space-y-8">
            {/* Session Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Study Session
              </label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                disabled={completeRandom}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {SESSIONS.map((label, index) => (
                  <option key={index} value={index === 0 ? "all" : index.toString()}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Choose a specific session or all sessions for complete randomness
              </p>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Number of Questions (10 - 60)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="10"
                  max="60"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Math.min(60, Math.max(10, parseInt(e.target.value) || 10)))}
                  disabled={completeRandom}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {numQuestions} questions
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Set how many questions you want to answer
              </p>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Time Limit in Minutes (5 - 120)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Math.min(120, Math.max(5, parseInt(e.target.value) || 5)))}
                  disabled={completeRandom}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  {timeLimit} minutes
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Set your preferred time duration for the quiz
              </p>
            </div>

            {/* Complete Random Checkbox */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={completeRandom}
                  onChange={handleToggleRandom}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="font-semibold text-gray-900">
                  Complete Randomness Mode
                </span>
              </label>
              <p className="mt-3 text-sm text-gray-600">
                Enable for maximum randomization: all sessions mixed, 60 questions, and 60 minutes.
                This overrides individual settings above.
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Quiz Summary</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-700">
                  <span className="font-medium">Session:</span>{" "}
                  <span className="text-blue-600">
                    {completeRandom ? "All Sessions (Random)" : SESSIONS[parseInt(session) || 0]}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Questions:</span>{" "}
                  <span className="text-blue-600">{numQuestions}</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Time:</span>{" "}
                  <span className="text-blue-600">{timeLimit} minutes</span>
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Link
                to="/"
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </Link>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Begin Quiz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
