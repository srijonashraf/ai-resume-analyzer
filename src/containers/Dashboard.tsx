import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStore, AnalysisHistoryEntry } from "../state/useStore";
import { analyzeResume } from "../services/geminiAI";
import PdfUploader from "../components/PdfUploader";
import AnalysisResults from "../components/AnalysisResults";
import JobDescriptionInput from "../components/JobDescriptionInput";
import JobMatchResults from "../components/JobMatchResults";
import AnalysisHistory from "../components/AnalysisHistory";
import { v4 as uuidv4 } from "uuid";

const Dashboard = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resumeData = useStore((state) => state.resumeData);
  const analysisResults = useStore((state) => state.analysisResults);
  const jobMatchResults = useStore((state) => state.jobMatchResults);
  const analysisHistory = useStore((state) => state.analysisHistory);
  const setAnalysisResults = useStore((state) => state.setAnalysisResults);
  const addAnalysisHistory = useStore((state) => state.addAnalysisHistory);
  const clearCurrentAnalysis = useStore((state) => state.clearCurrentAnalysis);

  // Analyze resume when it's uploaded
  useEffect(() => {
    const analyzeUploadedResume = async () => {
      if (resumeData && !analysisResults) {
        setIsAnalyzing(true);
        setError(null);

        try {
          const results = await analyzeResume(resumeData.rawText);
          setAnalysisResults(results);

          // Add to history
          const historyEntry: AnalysisHistoryEntry = {
            id: uuidv4(),
            date: new Date(),
            resumeData,
            analysisResults: results,
          };

          addAnalysisHistory(historyEntry);
        } catch (err) {
          console.error("Error analyzing resume:", err);
          setError("Failed to analyze resume. Please try again.");
        } finally {
          setIsAnalyzing(false);
        }
      }
    };

    analyzeUploadedResume();
  }, [resumeData, analysisResults, setAnalysisResults, addAnalysisHistory]);

  const handleNewAnalysis = () => {
    clearCurrentAnalysis();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Resume Radar</h1>

            {resumeData && (
              <button
                onClick={handleNewAnalysis}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                New Analysis
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!resumeData ? (
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6 mb-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Upload Your Resume
                </h2>
                <p className="text-gray-600 mb-6">
                  Our AI will analyze your resume and provide personalized
                  feedback to help you improve it.
                </p>

                <PdfUploader />
              </motion.div>

              {analysisHistory.length > 0 && (
                <div className="mt-8">
                  <AnalysisHistory />
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {isAnalyzing ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <h2 className="text-xl font-medium text-gray-700">
                    Analyzing your resume...
                  </h2>
                  <p className="text-gray-500 mt-2">
                    This may take a few moments.
                  </p>
                </div>
              ) : error ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="text-red-500 text-xl mb-4">⚠️</div>
                  <h2 className="text-xl font-medium text-gray-700">
                    Analysis Error
                  </h2>
                  <p className="text-red-500 mt-2">{error}</p>
                  <button
                    onClick={handleNewAnalysis}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  {analysisResults && (
                    <AnalysisResults analysisResults={analysisResults} />
                  )}

                  {!jobMatchResults ? (
                    <JobDescriptionInput />
                  ) : (
                    <JobMatchResults jobMatchResults={jobMatchResults} />
                  )}

                  {analysisHistory.length > 0 && <AnalysisHistory />}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
