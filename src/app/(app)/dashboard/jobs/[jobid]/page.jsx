"use client";

import axios from "axios";
import { ArrowLeft, Briefcase, Calendar, Clock, MapPin } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [jobDetails, setJobDetails] = useState();
  const params = useParams();
  const jobId = params.jobid;
  console.log(jobId);
  const {
    applications,
    company,
    createdAt,
    description,
    jobType,
    location,
    salary,
    title,
    expires,
    skills,
  } = jobDetails || {};

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/api/create-job/${jobId}`);

      // Access response data
      const data = response.data;
      console.log(data.data);

      if (data.success) {
        setJobDetails(data.data);
      } else {
        console.error("Job not found or other error:", data.message);
      }
    } catch (error) {
      console.error(
        "Error fetching job details:",
        error.response?.data?.message || error.message
      );
      return null;
    }
  };
  useEffect(() => {
    fetchJobDetails();
  }, []);
  return (
    <div className="dark:bg-black min-h-screen pt-24 px-4 md:px-8 lg:px-36">
      {/* Back Button */}
      <div className="flex items-center mb-8 ml-3">
        <ArrowLeft className="w-5 h-5 mr-2 dark:text-white" />
        <span className="dark:text-white">Back to job listings</span>
      </div>
      
      <div className="relative max-w-full">
        <div className="flex gap-8">
          {/* Main Content - Left Side */}
          <div className="dark:text-white w-3/4">
            {/* Job Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>

            {/* Company */}
            <div className="flex items-center mb-8">
              <Briefcase className="w-5 h-5 mr-2 text-gray-400" />
              <span className="text-gray-400">{company}</span>
            </div>

            {/* Job Description Container */}
            <div className="dark:bg-gray-900 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6">Job Description</h2>

              {/* Job Title */}
              <div className="mb-6">
                <p className="text-lg">
                  {title} at {company}
                </p>
              </div>

              {/* About the Company */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">
                  1. About the Company
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Jy Dada is a dynamic and innovative company at the forefront
                  of{" "}
                  <span className="text-blue-400 font-medium">
                    [Insert Jy Dada's Industry/Focus Here - e.g., personalized
                    healthcare, sustainable energy solutions, cutting-edge
                    financial technology]
                  </span>
                  . We are passionate about leveraging the power of data and
                  machine learning to{" "}
                  <span className="text-blue-400 font-medium">
                    [Insert Jy Dada's Mission/Goal - e.g., revolutionize patient
                    care, optimize energy consumption, transform financial
                    decision-making]
                  </span>
                  . We foster a collaborative and supportive environment where
                  creativity and technical excellence are highly valued. We
                  believe in empowering our employees to learn, grow, and
                  contribute to meaningful projects that have a real-world
                  impact. Join us and be a part of shaping the future!
                </p>
              </div>

              {/* Job Overview */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">2. Job Overview</h3>
                <p className="text-gray-300 leading-relaxed">
                  We are seeking a highly motivated and skilled Machine Learning
                  Engineer to join our growing team. In this role, you will be
                  responsible for designing, developing, deploying, and
                  maintaining machine learning models that drive our core
                  business objectives. You will work closely with a team of data
                  scientists, software engineers, and product managers to build
                  and implement innovative solutions that leverage the power of
                  data to solve complex problems. This is an exciting
                  opportunity to contribute to a rapidly evolving field and make
                  a significant impact on our company's success.
                </p>
              </div>

              {/* Responsibilities */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">
                  3. Responsibilities
                </h3>
                <div className="text-gray-300 leading-relaxed space-y-3">
                  <p>
                    Design, develop, and deploy machine learning models for
                    various applications, including{" "}
                    <span className="text-blue-400 font-medium">
                      [Insert specific examples relevant to Jy Dada's work -
                      e.g., fraud detection, recommendation systems, predictive
                      analytics]
                    </span>
                    .
                  </p>
                  <p>
                    Collaborate with data scientists to understand project
                    requirements, data sources, and model objectives.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="sticky top-28 dark:bg-gray-900 dark:text-white p-6 rounded-lg shadow-lg w-1/4 h-fit">
            {/* Location */}
            <div className="flex items-center mb-6">
              <MapPin className="w-5 h-5 mr-3 text-gray-400" />
              <span className="text-lg font-medium">{location}</span>
            </div>

            {/* Date Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <span className="text-gray-400">Posted: </span>
                  <span className="dark:text-white">{createdAt}</span>
                </div>
              </div>

              {expires && (
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-gray-400" />
                  <div>
                    <span className="text-gray-400">Expires: </span>
                    <span className="dark:text-white">{expires}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Required Skills */}
            <div className="mb-6">
              <h3 className="dark:text-white font-semibold mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills?.map((skill, index) => (
                  <span key={index} className="bg-gray-800 dark:text-white px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button className="w-full bg-gray-300 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors duration-200">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
