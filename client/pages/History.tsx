import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, BarChart3 } from "lucide-react";

interface HistoryRecord {
  date: string;
  time: string;
  session: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken: string;
}

export default function History() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const historyStr = localStorage.getItem("quizHistory");
    if (historyStr) {
      setHistory(JSON.parse(historyStr));
    }
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to delete all history? This cannot be undone.")) {
      localStorage.removeItem("quizHistory");
      setHistory([]);
    }
  };

  const handleDeleteRecord = (index: number) => {
    if (confirm("Delete this record?")) {
      const newHistory = history.filter((_, i) => i !== index);
      setHistory(newHistory);
      localStorage.setItem("quizHistory", JSON.stringify(newHistory));
    }
  };

  const filteredHistory =
    filter === "all"
      ? history
      : history.filter((record) => record.session === filter);

  // Calculate statistics
  const stats = {
    totalSessions: history.length,
    averageScore:
      history.length > 0
        ? (
            history.reduce((sum, r) => sum + r.percentage, 0) / history.length
          ).toFixed(1)
        : 0,
    bestScore: history.length > 0 ? Math.max(...history.map((r) => r.percentage)) : 0,
    totalQuestions: history.reduce((sum, r) => sum + r.total, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Practice History</h1>
          </div>
          <p className="text-gray-600">
            Track your progress and review all your practice sessions
          </p>
        </div>

        {/* Statistics Cards */}
        {history.length > 0 && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Total Sessions</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalSessions}</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Average Score</p>
              <p className="text-3xl font-bold text-green-600">{stats.averageScore}%</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Best Score</p>
              <p className="text-3xl font-bold text-purple-600">{stats.bestScore}%</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">Questions Done</p>
              <p className="text-3xl font-bold text-orange-600">{stats.totalQuestions}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {history.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No practice sessions yet
              </h2>
              <p className="text-gray-600 mb-8">
                Start practicing to build your history and track your progress
              </p>
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Start Practice Now
              </Link>
            </div>
          ) : (
            <>
              {/* Filter and Actions */}
              <div className="bg-gray-50 border-b border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Filter by Session
                    </label>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="all">All Sessions</option>
                      <option value="All Sessions (Random)">Random Mode</option>
                      {Array.from({ length: 15 }, (_, i) => (
                        <option key={i} value={`Session ${i + 1}`}>
                          Session {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={handleClearHistory}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All History
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Session
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Accuracy
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Time Taken
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredHistory.map((record, idx) => {
                      let scoreColor = "text-red-600";
                      let scoreBg = "bg-red-50";
                      if (record.percentage >= 70) {
                        scoreColor = "text-green-600";
                        scoreBg = "bg-green-50";
                      } else if (record.percentage >= 50) {
                        scoreColor = "text-yellow-600";
                        scoreBg = "bg-yellow-50";
                      }

                      return (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-700">
                            <div className="font-medium">{record.date}</div>
                            <div className="text-xs text-gray-500">{record.time}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {record.session}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold">
                            {record.score}/{record.total}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${scoreColor} ${scoreBg}`}
                            >
                              {record.percentage}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {record.timeTaken}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteRecord(history.indexOf(record))}
                              className="text-red-600 hover:text-red-700 font-medium text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredHistory.length === 0 && (
                <div className="p-12 text-center text-gray-600">
                  No records found for the selected filter.
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            to="/"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Back to Home
          </Link>
          {history.length > 0 && (
            <Link
              to="/quiz"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Start New Practice
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
