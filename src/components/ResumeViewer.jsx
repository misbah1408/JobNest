import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import PDFViewer from "./PDFViewer"; // Adjust path if needed

export default function ResumeViewer({ applicant }) {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        onClick={() => {
          setShowModal(true);
        }}
      >
        View resume <ArrowRight className="h-4 w-4" />
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-gray-400   bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg w-[50%] max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {applicant.user.name}'s Resume
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
              
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-4 flex-grow">
              <PDFViewer url={applicant.resumeUrl} />
            </div>

            {/* Footer (optional) */}
            <div className="p-4 border-t text-right">
              {/* Add action buttons if needed */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
