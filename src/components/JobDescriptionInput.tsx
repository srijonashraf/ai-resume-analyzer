import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../state/useStore';
import { compareWithJobDescription } from '../services/geminiAI';

const JobDescriptionInput = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const resumeData = useStore((state) => state.resumeData);
  const jobDescription = useStore((state) => state.jobDescription);
  const setJobDescription = useStore((state) => state.setJobDescription);
  const setJobMatchResults = useStore((state) => state.setJobMatchResults);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeData) {
      setError('Please upload a resume first');
      return;
    }
    
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await compareWithJobDescription(
        resumeData.rawText,
        jobDescription
      );
      
      setJobMatchResults(results);
    } catch (err) {
      console.error('Error comparing with job description:', err);
      setError('Failed to analyze job match. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description Matching</h2>
      <p className="text-gray-600 mb-6">
        Paste a job description to compare with your resume and get personalized recommendations.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={handleInputChange}
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !resumeData}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${isLoading || !resumeData
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Compare with Job Description'
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default JobDescriptionInput;
