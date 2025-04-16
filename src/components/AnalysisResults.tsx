import { motion } from "framer-motion";
import { AnalysisResult } from "../state/useStore";
import AnalysisRadarChart from "./AnalysisRadarChart";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface AnalysisResultsProps {
  analysisResults: AnalysisResult;
}

const AnalysisResults = ({ analysisResults }: AnalysisResultsProps) => {
  const { suggestions, missingSkills } = analysisResults;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Resume Analysis Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="bg-gray-50 rounded-lg p-4 items-center flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Score Breakdown
          </h3>
          <AnalysisRadarChart analysisResults={analysisResults} />
        </div>

        {/* Suggestions and Missing Skills */}
        <div>
          {/* Suggestions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Improvement Suggestions
            </h3>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{suggestion}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Missing Skills */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Missing Skills
            </h3>
            <ul className="space-y-2">
              {missingSkills.map((skill, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{skill}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisResults;
