
import Link from 'next/link';
import React from 'react';

const PostedJobs = ({jobs}) => {
  console.log(jobs);
  
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Your Posted Jobs</h2>

      <div className="space-y-4">
        {jobs?.map((job) => (
          <div
            key={job._id}
            className="p-4 bg-white rounded-lg shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div>
              <h3 className="text-lg font-bold">{job.title}</h3>
              <p className="text-sm text-gray-500">{job.location}</p>
              <p className="text-xs text-gray-400 mt-1">Posted on: {new Date(job.createdAt).toLocaleDateString()}</p>
              <p className="text-sm mt-2">Applications: {job.applications}</p>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              {job.applications > 0 && <Link href={`/dashboard/employer/${job._id}`}><button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
                View Applicants
              </button></Link>}
              <button className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 text-sm">
                Edit
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostedJobs;
