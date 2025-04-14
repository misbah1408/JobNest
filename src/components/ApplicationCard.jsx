import React from 'react';
import { CheckCircle, XCircle, Clock, FileText, ClipboardList, CalendarDays } from 'lucide-react';

const ApplicationCard = ({ application }) => {
  const {
    appliedAt,
    coverLetter,
    employerNotes,
    jobId,
    resumeUrl,
    status,
  } = application || {};

  const formattedDate = new Date(appliedAt).toLocaleDateString();

  const statusMap = {
    accepted: {
      text: "Accepted",
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
    },
    rejected: {
      text: "Rejected",
      color: "bg-red-100 text-red-700",
      icon: <XCircle className="w-4 h-4 mr-1 text-red-600" />
    },
    pending: {
      text: "Pending",
      color: "bg-yellow-100 text-yellow-700",
      icon: <Clock className="w-4 h-4 mr-1 text-yellow-500" />
    }
  };

  const currentStatus = statusMap[status] || {
    text: status || "Unknown",
    color: "bg-gray-100 text-gray-700",
    icon: <ClipboardList className="w-4 h-4 mr-1 text-gray-500" />
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-2xl mx-auto my-6 border border-gray-100">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Application for Job ID: <span className="text-indigo-600 font-bold">{jobId}</span>
        </h2>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatus.color}`}>
          {currentStatus.icon}
          {currentStatus.text}
        </div>
      </div>

      <div className="flex items-center text-gray-600 text-sm mb-4">
        <CalendarDays className="w-4 h-4 mr-2 text-gray-500" />
        Applied on: <span className="ml-1 font-medium text-gray-700">{formattedDate}</span>
      </div>

      <div className="mb-4">
        <p className="text-gray-800 font-semibold mb-1 flex items-center">
          <FileText className="w-4 h-4 mr-2 text-indigo-500" />
          Cover Letter:
        </p>
        <p className="text-gray-600 pl-6">{coverLetter || "N/A"}</p>
      </div>

      <div className="mb-4">
        <p className="text-gray-800 font-semibold mb-1 flex items-center">
          <ClipboardList className="w-4 h-4 mr-2 text-indigo-500" />
          Employer Notes:
        </p>
        <p className="text-gray-600 pl-6">{employerNotes || "No notes from employer yet."}</p>
      </div>

      {resumeUrl && (
        <div className="mt-4">
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-indigo-600 hover:underline font-medium"
          >
            📄 View Resume →
          </a>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
