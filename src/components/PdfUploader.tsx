import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore, ResumeData } from '../state/useStore';
import { extractTextFromPDF } from '../utils/pdfUtils';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

const PdfUploader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setResumeData = useStore((state) => state.setResumeData);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Extract text from PDF
      const rawText = await extractTextFromPDF(file);
      
      // Update store with resume data
      const resumeData: ResumeData = {
        file,
        rawText
      };
      
      setResumeData(resumeData);
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError('Failed to process PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Create a new FileList with the dropped file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      // Update the file input
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        
        // Trigger the onChange event manually
        const event = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(event);
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isLoading ? 'bg-gray-100 border-gray-300' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
        />
        
        <DocumentArrowUpIcon className="h-12 w-12 mx-auto text-blue-500 mb-4" />
        
        {isLoading ? (
          <div className="text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p>Processing PDF...</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-700 mb-1">
              Drag & drop your resume PDF here
            </p>
            <p className="text-sm text-gray-500">
              or click to browse files
            </p>
          </div>
        )}
        
        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}
      </div>
    </motion.div>
  );
};

export default PdfUploader;
