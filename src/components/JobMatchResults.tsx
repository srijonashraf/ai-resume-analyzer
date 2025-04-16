import { motion } from 'framer-motion';
import { JobMatchResult } from '../state/useStore';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface JobMatchResultsProps {
  jobMatchResults: JobMatchResult;
}

const JobMatchResults = ({ jobMatchResults }: JobMatchResultsProps) => {
  const { matchPercentage, missingSkills, suggestions } = jobMatchResults;
  
  // Determine color based on match percentage
  const getMatchColor = () => {
    if (matchPercentage >= 80) return 'text-green-600';
    if (matchPercentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Job Match Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Match Percentage */}
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Match Score</h3>
          <div className={`text-5xl font-bold ${getMatchColor()}`}>
            {matchPercentage}%
          </div>
          <p className="text-gray-500 mt-2 text-center">
            {matchPercentage >= 80 
              ? 'Great match! You\'re well qualified for this position.'
              : matchPercentage >= 60
                ? 'Good match with some areas for improvement.'
                : 'Consider enhancing your resume to better match this job.'}
          </p>
        </div>
        
        {/* Suggestions and Missing Skills */}
        <div>
          {/* Missing Skills */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Missing Skills</h3>
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
          
          {/* Suggestions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Improvement Suggestions</h3>
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
        </div>
      </div>
    </motion.div>
  );
};

export default JobMatchResults;
