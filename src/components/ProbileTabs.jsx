"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Edit, PlusIcon, Trash2Icon, X } from "lucide-react";
import { toast } from "sonner";

const ProfileTabs = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [formData, setFormData] = useState({
    personal: {
      tagline: "",
      about: "",
      state: "",
      skills: "",
    },
    education: {
      college_university: "",
      degree: "",
      field_of_study: "",
      graduation_year: "",
    },
    projects: {
      title: "",
      link: "",
      description: "",
      technologies: "",
    },
    work_experience: {
      job_title: "",
      company: "",
      duration: "",
      responsibilities: "",
    },
  });
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResumeData = async () => {
    if (!user?._id) return;
    try {
      const res = await axios.get(`/api/resume-data?userId=${user._id}`);
      setResumeData(res.data.resume);
      console.log(res.data.resume);
    } catch (error) {
      console.error("Failed to fetch resume data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
  if (!resumeData?._id) return;

  try {
    // Call backend to update resume (remove project)
    const res = await axios.put(`/api/resume-data?resumeId=${resumeData._id}`, {
      projects: resumeData.projects.filter((proj) => proj._id !== projectId),
    });

    if (res.data.success) {
      // Update resumeData in-place
      setResumeData((prev) => ({
        ...prev,
        projects: prev.projects.filter((proj) => proj._id !== projectId),
      }));
    }
  } catch (error) {
    console.error("Failed to delete project:", error);
  }
};


  useEffect(() => {
    fetchResumeData();
  }, [user?._id]);

  if (loading)
    return <p className="text-center text-gray-500">Loading profile...</p>;

  return (
    <Card className="w-full shadow-md p-4 md:p-6">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-full">
          <TabsTrigger value="personal" className="text-sm md:text-base">
            Personal Details
          </TabsTrigger>
          <TabsTrigger value="education" className="text-sm md:text-base">
            Education
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-sm md:text-base">
            Projects
          </TabsTrigger>
          <TabsTrigger value="work" className="text-sm md:text-base">
            Work Experience
          </TabsTrigger>
        </TabsList>

        {/* PERSONAL DETAILS */}
        <TabsContent value="personal" className="mt-4 space-y-10 px-8">
          <div className="grid gap-8">
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                defaultValue={resumeData?.personal?.tagline || ""}
                placeholder="e.g. Full-Stack Developer"
                className={"rounded-full h-12"}
              />
            </div>
            <div className="space-y-2">
              <Label>About</Label>
              <Textarea
                defaultValue={resumeData?.personal?.about || ""}
                placeholder="Tell something about yourself..."
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                defaultValue={user?.email || ""}
                placeholder="your@email.com"
                readOnly
                className={"rounded-full h-12"}
              />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input
                defaultValue={resumeData?.personal?.state || ""}
                placeholder="e.g. California"
                className={"rounded-full h-12"}
              />
            </div>
            <div className="space-y-2">
              <Label>Skills</Label>
              <Input
                placeholder="e.g. React, Node.js, Tailwind CSS"
                className={"rounded-full h-12"}
              />

              <div className="flex flex-wrap gap-2">
                {resumeData?.personal?.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <X size={10} />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* EDUCATION */}
        <TabsContent value="education" className="mt-4 space-y-10 px-8">
          <div className="space-y-3">
            {resumeData?.education?.length > 0 ? (
              resumeData.education.map((edu, idx) => (
                <div key={idx} className="p-3 border rounded relative">
                  <p>
                    <strong>{edu.degree}</strong> in {edu.field_of_study}
                  </p>
                  <p>{edu.college_university}</p>
                  <p>Graduated: {edu.graduation_year}</p>

                  {/* Delete Button */}
                  <Button
                    variant="none"
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                    onClick={async () => {
                      try {
                        const updatedEducation = resumeData.education.filter(
                          (_, i) => i !== idx
                        );
                        await axios.put(
                          `/api/resume-data?resumeId=${resumeData?._id}`,
                          {
                            userId: user._id,
                            education: updatedEducation,
                          }
                        );
                        toast.success("Education removed!");
                        fetchResumeData();
                      } catch {
                        toast.error("Failed to delete education");
                      }
                    }}
                  >
                    <Trash2Icon size={16} />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No education details yet.</p>
            )}
          </div>

          {/* Add Education Dialog */}
          <Dialog>
            <div className="bg-gray-100 px-10 py-5 rounded-3xl w-fit flex flex-col justify-center items-center m-auto dark:bg-transparent dark:border-gray-500 border">
              <span className="font-semibold">Education Details</span>
              <DialogTrigger asChild>
                <button className="flex p-3 rounded-full border border-blue-500 text-blue-500 mt-2 justify-between items-center bg-white dark:bg-blue-950">
                  <PlusIcon size={18} /> Add Education
                </button>
              </DialogTrigger>
            </div>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Education</DialogTitle>
              </DialogHeader>

              {/* Local state for new education */}
              <div className="grid gap-4">
                <div>
                  <Label>College / University Name *</Label>
                  <Input
                    placeholder="Enter your college/university"
                    value={formData.education.college_university}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        education: {
                          ...prev.education,
                          college_university: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Graduation Year *</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 2025"
                    value={formData.education.graduation_year}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        education: {
                          ...prev.education,
                          graduation_year: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Field of Study *</Label>
                  <Input
                    placeholder="e.g. Computer Science"
                    value={formData.education.field_of_study}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        education: {
                          ...prev.education,
                          field_of_study: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Degree *</Label>
                  <Input
                    placeholder="e.g. Bachelor's"
                    value={formData.education.degree}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        education: {
                          ...prev.education,
                          degree: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <Button
                  className="mt-2"
                  onClick={async () => {
                    if (
                      !formData.education.college_university ||
                      !formData.education.degree ||
                      !formData.education.field_of_study ||
                      !formData.education.graduation_year
                    ) {
                      toast.error("Please fill in all required fields");
                      return;
                    }

                    try {
                      const updatedEducation = [
                        ...(resumeData.education || []),
                        formData.education,
                      ];
                      await axios.put(
                        `/api/resume-data?resumeId=${resumeData?._id}`,
                        {
                          userId: user._id,
                          education: updatedEducation,
                        }
                      );
                      toast.success("Education added!");
                      fetchResumeData();

                      // Reset form after save
                      setFormData((prev) => ({
                        ...prev,
                        education: {
                          college_university: "",
                          degree: "",
                          field_of_study: "",
                          graduation_year: "",
                        },
                      }));
                    } catch {
                      toast.error("Failed to save education");
                    }
                  }}
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* PROJECTS */}
        <TabsContent value="projects" className="mt-4 space-y-4 px-4">
          <h3 className="text-lg font-semibold mb-2">Projects</h3>
          <p className="text-sm text-gray-600">
            Showcase your best work and highlight your achievements.
          </p>

          {/* Existing Projects */}
          <div className="space-y-3">
            {resumeData?.projects?.length > 0 ? (
              resumeData.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="relative p-3 border rounded-3xl space-y-3"
                >
                  <p className="text-lg">
                    <strong>{project.title}</strong>
                  </p>
                  <p className="text-sm">{project.description}</p>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {project.link}
                    </a>
                  )}

                  {/* Technologies */}
                  <div className="flex gap-1 flex-wrap">
                    {project.technologies?.map((tech, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-[12px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Edit / Delete */}
                  <div className="absolute flex gap-2 right-2 top-2 flex-shrink-0">
                    <Button
                      variant={"none"}
                      className="transition-colors duration-500 size-9 h-8 w-8 text-gray-500 hover:text-blue-600 bg-blue-500/20 flex justify-center items-center rounded-full"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant={"none"}
                      onClick={() => handleDeleteProject(project._id)}
                      className="transition-colors duration-500 size-9 h-8 w-8 text-gray-500 hover:text-red-600 bg-blue-500/20 flex justify-center items-center rounded-full"
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No projects added yet.</p>
            )}
          </div>

          {/* Add Project Dialog */}
          <Dialog>
            <div className="bg-gray-100 px-10 py-5 rounded-3xl w-fit flex flex-col justify-center items-center m-auto dark:bg-transparent dark:border-gray-500 border">
              <span className="font-semibold">Projects</span>
              <DialogTrigger asChild>
                <button className="flex p-3 rounded-full border border-blue-500 text-blue-500 mt-2 justify-between items-center bg-white dark:bg-blue-950">
                  <PlusIcon size={18} /> Add Project
                </button>
              </DialogTrigger>
            </div>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Project</DialogTitle>
              </DialogHeader>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const newProject = {
                    title: formData.get("title"),
                    link: formData.get("link"),
                    description: formData.get("description"),
                    technologies: formData
                      .get("technologies")
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  };

                  try {
                    await axios.put(
                      `/api/resume-data?resumeId=${resumeData._id}`,
                      {
                        projects: [...(resumeData?.projects || []), newProject],
                      }
                    );
                    setResumeData((prev) => ({
                      ...prev,
                      projects: [...(prev?.projects || []), newProject],
                    }));
                  } catch (error) {
                    console.error("Failed to save project", error);
                  }
                }}
                className="grid gap-4"
              >
                <div>
                  <Label>Project Title *</Label>
                  <Input
                    name="title"
                    placeholder="Enter your project title"
                    required
                  />
                </div>
                <div>
                  <Label>Project Link</Label>
                  <Input name="link" placeholder="https://github.com/..." />
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    name="description"
                    placeholder="Brief description of the project"
                    required
                  />
                </div>
                <div>
                  <Label>Technologies</Label>
                  <Input
                    name="technologies"
                    placeholder="React, Node.js, Tailwind CSS"
                  />
                </div>
                <Button type="submit" className="mt-2">
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* WORK EXPERIENCE */}
        <TabsContent value="work" className="mt-4 space-y-10 px-8">
          <h3 className="text-lg font-semibold mb-2">Work Experience</h3>
          <p className="text-sm text-gray-600">
            List your professional experience.
          </p>

          <div className="space-y-3">
            {resumeData?.work_experience?.length > 0 ? (
              resumeData.work_experience.map((job, idx) => (
                <div key={idx} className="p-3 border rounded">
                  <p>
                    <strong>{job.job_title}</strong> @ {job.company}
                  </p>
                  <p>{job.duration}</p>
                  <p>{job.responsibilities}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No work experience added yet.</p>
            )}
          </div>

          <Dialog>
            <div className="bg-gray-100 px-10 py-5 rounded-3xl w-fit flex flex-col justify-center items-center m-auto dark:bg-transparent dark:border-gray-500 border">
              <span className="font-semibold">Work Experience</span>
              <DialogTrigger asChild>
                <button className="flex p-3 rounded-full border border-blue-500 text-blue-500 mt-2 justify-between items-center bg-white dark:bg-blue-950">
                  <PlusIcon size={18} /> Add Experience
                </button>
              </DialogTrigger>
            </div>
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
