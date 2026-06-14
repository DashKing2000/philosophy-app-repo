import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle } from "lucide-react";
import { questionBank } from "@/data/questionBank";

interface QuizQuestion {
  id: number;
  q: string;
  shuffledOptions: string[];
  correctAnswer: number;
}

export default function Quiz() {
  const navigate = useNavigate();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [quizConfig, setQuizConfig] = useState({
    session: "all",
    numQuestions: 20,
    timeLimit: 30,
  });

  // Initialize quiz
  useEffect(() => {
    const configStr = sessionStorage.getItem("quizConfig");
    if (!configStr) {
      navigate("/quiz");
      return;
    }

    const config = JSON.parse(configStr);
    setQuizConfig(config);
    setTimeLeft(config.timeLimit * 60);

    // Filter questions
    let pool = config.session === "all"
      ? [...questionBank]
      : questionBank.filter((q) => q.session === parseInt(config.session));

    // Shuffle and slice
    pool = pool.sort(() => Math.random() - 0.5).slice(0, config.numQuestions);

    // Shuffle options for each question
    const questions = pool.map((q) => {
      const optionsWithIndex = q.options.map((opt, idx) => ({
        text: opt,
        isCorrect: idx === q.a,
      }));
      const shuffled = optionsWithIndex.sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffled.findIndex((opt) => opt.isCorrect);

      return {
        id: q.id,
        q: q.q,
        shuffledOptions: shuffled.map((opt) => opt.text),
        correctAnswer: newCorrectIndex,
      };
    });

    setCurrentQuestions(questions);
    setQuizStarted(true);
  }, [navigate]);

  // Timer
  useEffect(() => {
    if (!quizStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuizConfirmed();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted]);

  if (!quizStarted || currentQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  const question = currentQuestions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeWarning = timeLeft <= 300; // 5 minutes

  const handleAnswerSelect = (optionIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNavigation = (index: number) => {
    setCurrentIndex(index);
  };

  const handleSubmitClick = () => {
    setShowConfirmation(true);
  };

  const submitQuizConfirmed = () => {
    let score = 0;
    currentQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        score++;
      }
    });

    // Store results
    sessionStorage.setItem(
      "quizResults",
      JSON.stringify({
        score,
        total: currentQuestions.length,
        answers: userAnswers,
        questions: currentQuestions,
        session: quizConfig.session,
        timeSpent: quizConfig.timeLimit * 60 - timeLeft,
      })
    );

    navigate("/results");
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header with Controls at Top */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  Question {currentIndex + 1} of {currentQuestions.length}
                </p>
                <p className="text-lg font-semibold mt-1">
                  {Math.round(
                    ((currentIndex + 1) / currentQuestions.length) * 100
                  )}% Complete
                </p>
              </div>
              <div
                className={`text-3xl font-bold font-mono flex items-center gap-2 ${
                  isTimeWarning ? "text-yellow-300 animate-pulse" : ""
                }`}
              >
                <Clock className="w-6 h-6" />
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
            </div>

            {/* Progress bar */}
            <div className="bg-blue-900 rounded-full h-2 overflow-hidden mb-6">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / currentQuestions.length) * 100}%`,
                }}
              ></div>
            </div>

            {/* Top Controls */}
            <div className="flex gap-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <button
                onClick={handleSubmitClick}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
              >
                <Send className="w-5 h-5" />
                Submit Quiz
              </button>

              <button
                onClick={handleNext}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
              >
                {currentIndex === currentQuestions.length - 1 ? "Finish" : "Next"}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Question Section */}
          <div className="p-8">
            {/* Question Text */}
            <h2 className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">
              {question.q}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {question.shuffledOptions.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    userAnswers[currentIndex] === index
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentIndex}`}
                    checked={userAnswers[currentIndex] === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="w-5 h-5 text-blue-600 cursor-pointer"
                  />
                  <span className="ml-4 text-gray-900 font-medium">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="bg-gray-50 border-t border-gray-200 p-8">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Question Navigator
            </p>
            <div className="grid grid-cols-10 gap-2 mb-8">
              {currentQuestions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavigation(idx)}
                  className={`w-full aspect-square rounded-lg font-semibold text-sm transition-all ${
                    idx === currentIndex
                      ? "bg-blue-600 text-white shadow-lg"
                      : userAnswers[idx] !== undefined
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded"></div>
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                <span className="text-gray-600">Not Answered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8" />
                <h3 className="text-xl font-bold">Submit Quiz?</h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 font-medium mb-6">
                Are you sure you want to submit the quiz? You will be taken to the results page and cannot return to edit your answers.
              </p>

              <div className="space-y-3">
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  <span className="font-semibold">Questions answered:</span> {Object.keys(userAnswers).length} of {currentQuestions.length}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-200 p-6 flex gap-4">
              <button
                onClick={handleCancelSubmit}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                No, Keep Answering
              </button>
              <button
                onClick={submitQuizConfirmed}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
