import React from 'react';

const ApplicationCard = ({ application }) => {
  const {
    appliedAt,
    coverLetter,
    employerNotes,
    jobId,
    resumeUrl,
    status,
  } = application || "";
  // console.log(application);
  
  const formattedDate = new Date(appliedAt).toLocaleDateString();

  const statusColor = {
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-xl mx-auto my-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        Application for Job ID: <span className="text-indigo-600">{jobId}</span>
      </h2>

      <p className="mb-2">
        <span className="font-medium text-gray-700">Status:</span>{' '}
        <span className={`inline-block px-2 py-1 rounded ${statusColor[status] || 'bg-gray-100 text-gray-800'}`}>
          {status}
        </span>
      </p>

      <p className="mb-2 text-gray-700">
        <span className="font-medium">Applied At:</span> {formattedDate}
      </p>

      <div className="mb-3">
        <p className="font-medium text-gray-700">Cover Letter:</p>
        <p className="text-gray-600">{coverLetter}</p>
      </div>

      <div className="mb-3">
        <p className="font-medium text-gray-700">Employer Notes:</p>
        <p className="text-gray-600">{employerNotes}</p>
      </div>

      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-3 text-indigo-600 hover:underline"
      >
        View Resume →
      </a>
    </div>
  );
};

export default ApplicationCard;
