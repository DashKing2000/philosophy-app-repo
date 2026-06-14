import { Link } from "react-router-dom";
import { BookOpen, BarChart3 } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">
              Philosophy <span className="text-blue-600">CBT</span>
            </h1>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link
            to="/quiz"
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
