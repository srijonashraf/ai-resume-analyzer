import { motion } from 'framer-motion';
import { useStore, AnalysisHistoryEntry } from '../state/useStore';
import { DocumentTextIcon, CalendarIcon, ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';

const AnalysisHistory = () => {
  const analysisHistory = useStore((state) => state.analysisHistory);
  const removeFromHistory = useStore((state) => state.removeFromHistory);
  
  if (analysisHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6 text-center"
      >
        <ArrowPathIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Analysis History</h3>
        <p className="text-gray-500">
          Your previous resume analyses will appear here.
        </p>
      </motion.div>
    );
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this analysis from history?')) {
      removeFromHistory(id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis History</h2>
      
      <div className="space-y-4">
        {analysisHistory.map((entry: AnalysisHistoryEntry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <DocumentTextIcon className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-800">
                    Resume Analysis
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(entry.date).toLocaleDateString()} at {new Date(entry.date).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Remove from history"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <div className="text-sm">
                <span className="font-medium text-gray-700">Skills Score:</span>
                <span className="ml-2 text-gray-600">{entry.analysisResults.skills}/10</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Experience Score:</span>
                <span className="ml-2 text-gray-600">{entry.analysisResults.experience}/10</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">Format Score:</span>
                <span className="ml-2 text-gray-600">{entry.analysisResults.format}/10</span>
              </div>
              
              {entry.jobMatchResults && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Job Match:</span>
                  <span className="ml-2 text-gray-600">{entry.jobMatchResults.matchPercentage}%</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AnalysisHistory;

