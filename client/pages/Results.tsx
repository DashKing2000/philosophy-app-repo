import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, XCircle, Home, Eye, EyeOff } from "lucide-react";

interface QuizQuestion {
  id: number;
  q: string;
  shuffledOptions: string[];
  correctAnswer: number;
}

interface QuizResults {
  score: number;
  total: number;
  answers: Record<number, number>;
  questions: QuizQuestion[];
  session: string;
  timeSpent: number;
}

export default function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResults | null>(null);
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    const resultsStr = sessionStorage.getItem("quizResults");
    if (!resultsStr) {
      navigate("/");
      return;
    }

    const parsedResults = JSON.parse(resultsStr);
    setResults(parsedResults);

    // Save to history
    const historyStr = localStorage.getItem("quizHistory");
    const history = historyStr ? JSON.parse(historyStr) : [];

    const sessionName =
      parsedResults.session === "all"
        ? "All Sessions (Random)"
        : `Session ${parsedResults.session}`;

    const mins = Math.floor(parsedResults.timeSpent / 60);
    const secs = parsedResults.timeSpent % 60;

    history.unshift({
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      session: sessionName,
      score: parsedResults.score,
      total: parsedResults.total,
      percentage: Math.round((parsedResults.score / parsedResults.total) * 100),
      timeTaken: `${mins}m ${secs}s`,
    });

    // Keep only last 100 records
    if (history.length > 100) history.pop();

    localStorage.setItem("quizHistory", JSON.stringify(history));
  }, [navigate]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const percentage = Math.round((results.score / results.total) * 100);
  const mins = Math.floor(results.timeSpent / 60);
  const secs = results.timeSpent % 60;

  let performanceColor = "text-red-600";
  let performanceBg = "bg-red-100";
  if (percentage >= 70) {
    performanceColor = "text-green-600";
    performanceBg = "bg-green-100";
  } else if (percentage >= 50) {
    performanceColor = "text-yellow-600";
    performanceBg = "bg-yellow-100";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Score Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-12 text-center">
            <h1 className="text-3xl font-bold mb-8">Quiz Completed! 🎉</h1>

            <div className={`${performanceBg} ${performanceColor} rounded-full w-40 h-40 mx-auto flex flex-col items-center justify-center mb-8`}>
              <div className="text-5xl font-bold">{percentage}%</div>
              <div className="text-sm font-medium mt-2">Score</div>
            </div>

            <p className="text-xl font-semibold mb-4">
              You answered {results.score} out of {results.total} questions correctly
            </p>

            <div className="bg-blue-500 bg-opacity-50 rounded-lg p-4 inline-block text-lg font-medium">
              ⏱️ Time taken: {mins}m {secs}s
            </div>
          </div>

          {/* Performance Breakdown */}
          <div className="p-8">
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {results.score}
                </div>
                <p className="text-gray-600 text-sm mt-2">Correct</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {results.total - results.score}
                </div>
                <p className="text-gray-600 text-sm mt-2">Incorrect</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {percentage}%
                </div>
                <p className="text-gray-600 text-sm mt-2">Accuracy</p>
              </div>
            </div>

            {/* Feedback */}
            <div className={`${performanceBg} rounded-lg p-6 mb-8`}>
              <p className={`${performanceColor} font-semibold text-lg`}>
                {percentage >= 80 && "Excellent! You've mastered this material!"}
                {percentage >= 70 && percentage < 80 && "Great job! You have a solid understanding."}
                {percentage >= 50 && percentage < 70 && "Good effort! Review the material and try again."}
                {percentage < 50 && "Keep practicing! This material needs more study."}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 border-t border-gray-200 p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowReview(!showReview)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                {showReview ? (
                  <>
                    <EyeOff className="w-5 h-5" />
                    Hide Review
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    Review Answers
                  </>
                )}
              </button>

              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Review Section */}
        {showReview && (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
              <h2 className="text-2xl font-bold">Detailed Review</h2>
            </div>

            <div className="p-8 space-y-8">
              {results.questions.map((question, qIdx) => {
                const userAnswer = results.answers[qIdx];
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <div
                    key={qIdx}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                  >
                    {/* Question Header */}
                    <div className="flex items-start gap-4 mb-4">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {qIdx + 1}. {question.q}
                        </h3>
                      </div>
                    </div>

                    {/* Options Review */}
                    <div className="space-y-2 ml-10">
                      {question.shuffledOptions.map((option, optIdx) => {
                        const isCorrectOption = optIdx === question.correctAnswer;
                        const isUserAnswer = optIdx === userAnswer;

                        let bgColor = "bg-gray-50";
                        let borderColor = "border-gray-200";
                        let textColor = "text-gray-700";
                        let icon = "";

                        if (isCorrectOption) {
                          bgColor = "bg-green-50";
                          borderColor = "border-green-300";
                          textColor = "text-green-900";
                          icon = "✓";
                        } else if (isUserAnswer && !isCorrect) {
                          bgColor = "bg-red-50";
                          borderColor = "border-red-300";
                          textColor = "text-red-900";
                          icon = "✗";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-4 border-2 rounded-lg ${bgColor} ${borderColor}`}
                          >
                            <p className={`${textColor} font-medium`}>
                              {icon && `${icon} `}
                              {option}
                              {isCorrectOption && (
                                <span className="ml-2 text-xs font-semibold">
                                  (Correct Answer)
                                </span>
                              )}
                              {isUserAnswer && !isCorrect && (
                                <span className="ml-2 text-xs font-semibold">
                                  (Your Answer)
                                </span>
                              )}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Close Review Button */}
            <div className="bg-gray-50 border-t border-gray-200 p-8">
              <button
                onClick={() => setShowReview(false)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
