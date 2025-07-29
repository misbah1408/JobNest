"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const ProfileTabs = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResumeData = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`/api/resume-data?userId=${user._id}`);
      setResumeData(res.data.resume);
    } catch (error) {
      console.error("Failed to fetch resume data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, [user?._id]);

  if (loading) return <p className="text-center text-gray-500">Loading profile...</p>;

  return (
    <Card className="w-full shadow-md p-4 md:p-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-full">
          <TabsTrigger value="personal" className="text-sm md:text-base">Personal Details</TabsTrigger>
          <TabsTrigger value="education" className="text-sm md:text-base">Education</TabsTrigger>
          <TabsTrigger value="projects" className="text-sm md:text-base">Projects</TabsTrigger>
          <TabsTrigger value="work" className="text-sm md:text-base">Work Experience</TabsTrigger>
        </TabsList>

        {/* PERSONAL DETAILS */}
        <TabsContent value="personal" className="mt-4 space-y-4">
          <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
          <p className="text-sm text-gray-600">
            Update your personal information here, such as your name, email, and profile picture.
          </p>

          <div className="grid gap-4">
            <div>
              <Label>Tagline</Label>
              <Input
                defaultValue={resumeData?.personal?.tagline || ""}
                placeholder="e.g. Full-Stack Developer"
              />
            </div>
            <div>
              <Label>About</Label>
              <Textarea
                defaultValue={resumeData?.personal?.about || ""}
                placeholder="Tell something about yourself..."
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                defaultValue={resumeData?.personal?.email || user?.email || ""}
                placeholder="your@email.com"
              />
            </div>
            <div>
              <Label>State</Label>
              <Input
                defaultValue={resumeData?.personal?.state || ""}
                placeholder="e.g. California"
              />
            </div>
            <div>
              <Label>Skills</Label>
              <Input
                defaultValue={resumeData?.personal?.skills?.join(", ") || ""}
                placeholder="e.g. React, Node.js, Tailwind CSS"
              />
            </div>
          </div>
        </TabsContent>

        {/* EDUCATION */}
        <TabsContent value="education" className="mt-4 space-y-4">
          <h3 className="text-lg font-semibold mb-2">Education</h3>
          <p className="text-sm text-gray-600">Add or edit your academic qualifications.</p>

          <div className="space-y-3">
            {resumeData?.education?.length > 0 ? (
              resumeData.education.map((edu, idx) => (
                <div key={idx} className="p-3 border rounded">
                  <p><strong>{edu.degree}</strong> in {edu.field_of_study}</p>
                  <p>{edu.college_university}</p>
                  <p>Graduated: {edu.graduation_year}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No education details yet.</p>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Education</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Education</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div>
                  <Label>College / University Name</Label>
                  <Input placeholder="Enter your college/university" />
                </div>
                <div>
                  <Label>Graduation Year</Label>
                  <Input type="number" placeholder="e.g. 2025" />
                </div>
                <div>
                  <Label>Field of Study</Label>
                  <Input placeholder="e.g. Computer Science" />
                </div>
                <div>
                  <Label>Degree</Label>
                  <Input placeholder="e.g. Bachelor's" />
                </div>
                <Button className="mt-2">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* PROJECTS */}
        <TabsContent value="projects" className="mt-4 space-y-4">
          <h3 className="text-lg font-semibold mb-2">Projects</h3>
          <p className="text-sm text-gray-600">Showcase your best work and highlight your achievements.</p>

          <div className="space-y-3">
            {resumeData?.projects?.length > 0 ? (
              resumeData.projects.map((project, idx) => (
                <div key={idx} className="p-3 border rounded">
                  <p><strong>{project.title}</strong></p>
                  <p>{project.description}</p>
                  {project.link && (
                    <a href={project.link} target="_blank" className="text-blue-600 underline">
                      {project.link}
                    </a>
                  )}
                  <p>Technologies: {project.technologies?.join(", ")}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No projects added yet.</p>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Project</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Project</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div>
                  <Label>Project Title *</Label>
                  <Input placeholder="Enter your project title" />
                </div>
                <div>
                  <Label>Project Link</Label>
                  <Input placeholder="https://github.com/..." />
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea placeholder="Brief description of the project" />
                </div>
                <div>
                  <Label>Technologies</Label>
                  <Input placeholder="React, Node.js, Tailwind CSS" />
                </div>
                <Button className="mt-2">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* WORK EXPERIENCE */}
        <TabsContent value="work" className="mt-4 space-y-4">
          <h3 className="text-lg font-semibold mb-2">Work Experience</h3>
          <p className="text-sm text-gray-600">List your professional experience.</p>

          <div className="space-y-3">
            {resumeData?.work_experience?.length > 0 ? (
              resumeData.work_experience.map((job, idx) => (
                <div key={idx} className="p-3 border rounded">
                  <p><strong>{job.job_title}</strong> @ {job.company}</p>
                  <p>{job.duration}</p>
                  <p>{job.responsibilities}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No work experience added yet.</p>
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Work Experience</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Work Experience</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div>
                  <Label>Job Title *</Label>
                  <Input placeholder="e.g. Software Engineer" />
                </div>
                <div>
                  <Label>Company *</Label>
                  <Input placeholder="e.g. Google" />
                </div>
                <div>
                  <Label>Duration *</Label>
                  <Input placeholder="e.g. Jan 2021 - Present" />
                </div>
                <div>
                  <Label>Responsibilities</Label>
                  <Textarea placeholder="Describe your role and achievements" />
                </div>
                <Button className="mt-2">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ProfileTabs;
