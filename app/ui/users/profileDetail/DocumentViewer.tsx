import { FiDownload } from "react-icons/fi";

interface DocumentViewerProps {
  title: string;
  imageUrl: string;
  primaryColor: string;
}

const DocumentViewer = ({ title, imageUrl, primaryColor }: DocumentViewerProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-700">{title}</h3>
      </div>
      <div className="relative aspect-video bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-contain"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-document.png';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
          <button
            onClick={() => window.open(imageUrl, '_blank')}
            className="opacity-0 hover:opacity-100 bg-white p-2 rounded-full shadow-md transition-opacity duration-200"
            style={{ color: primaryColor }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-3 bg-gray-50 flex justify-end">
        <button 
          className="text-sm flex items-center gap-1 px-3 py-1 rounded hover:bg-gray-200 transition"
          onClick={() => window.open(imageUrl, '_blank')}
        >
          <FiDownload className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
};

export default DocumentViewer;