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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [dialogMode, setDialogMode] = useState("");
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingWork, setEditingWork] = useState(null);

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
      const res = await axios.put(
        `/api/resume-data?resumeId=${resumeData._id}`,
        {
          projects: resumeData.projects.filter(
            (proj) => proj._id !== projectId
          ),
        }
      );

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
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const updatedPersonal = {
                tagline: formData.get("tagline"),
                about: formData.get("about"),
                state: formData.get("state"),
                skills: resumeData?.personal?.skills || [],
              };

              try {
                await axios.put(
                  `/api/resume-data?resumeId=${resumeData?._id}`,
                  {
                    userId: user._id,
                    personal: updatedPersonal,
                  }
                );

                setResumeData((prev) => ({
                  ...prev,
                  personal: updatedPersonal,
                }));

                toast.success("Personal details updated!");
              } catch (error) {
                toast.error("Failed to save personal details");
              }
            }}
            className="grid gap-8"
          >
            {/* Tagline */}
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                name="tagline"
                defaultValue={resumeData?.personal?.tagline || ""}
                placeholder="e.g. Full-Stack Developer"
                className="rounded-full h-12"
              />
            </div>

            {/* About */}
            <div className="space-y-2">
              <Label>About</Label>
              <Textarea
                name="about"
                defaultValue={resumeData?.personal?.about || ""}
                placeholder="Tell something about yourself..."
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                defaultValue={user?.email || ""}
                placeholder="your@email.com"
                readOnly
                className="rounded-full h-12 bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label>State</Label>
              <Input
                name="state"
                defaultValue={resumeData?.personal?.state || ""}
                placeholder="e.g. California"
                className="rounded-full h-12"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex justify-center items-center gap-2">
                <Input
                  id="newSkill"
                  placeholder="e.g. React, Node.js"
                  className="rounded-full h-12 flex-1"
                />
                <Button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById("newSkill");
                    const skill = input.value.trim();
                    if (!skill) return;

                    const updatedSkills = [
                      ...(resumeData?.personal?.skills || []),
                      skill,
                    ];

                    setResumeData((prev) => ({
                      ...prev,
                      personal: { ...prev.personal, skills: updatedSkills },
                    }));

                    input.value = "";
                  }}
                >
                  Add
                </Button>
              </div>

              {/* Skill Chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {resumeData?.personal?.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        const updatedSkills = resumeData.personal.skills.filter(
                          (_, i) => i !== idx
                        );
                        setResumeData((prev) => ({
                          ...prev,
                          personal: { ...prev.personal, skills: updatedSkills },
                        }));
                      }}
                      className="hover:text-red-600"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="w-full flex justify-end">
              <Button type="submit" className="mt-4 w-fit rounded-lg">
                Save Changes
              </Button>
            </div>
          </form>
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

                  {/* Edit / Delete */}
                  <div className="absolute flex gap-2 right-2 top-2 flex-shrink-0">
                    <Button
                      variant={"none"}
                      className="transition-colors duration-500 size-9 h-8 w-8 text-gray-500 hover:text-blue-600 bg-blue-500/20 flex justify-center items-center rounded-full"
                      onClick={() => {
                        setDialogOpen(true);
                        setDialogMode("edit");
                        setEditingEducation(edu); // store selected education
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="none"
                      className="transition-colors duration-500 size-9 h-8 w-8 text-gray-500 hover:text-red-600 bg-blue-500/20 flex justify-center items-center rounded-full"
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
                </div>
              ))
            ) : (
              <p className="text-gray-500">No education details yet.</p>
            )}
          </div>

          {/* Add / Edit Education Dialog */}
          <EducationDialog
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            mode={dialogMode} // "new" or "edit"
            defaultValue={editingEducation || {}}
            resumeData={resumeData}
            setResumeData={setResumeData}
            user={user}
            fetchResumeData={fetchResumeData}
          />

          {/* Add button */}
          <div className="bg-gray-100 px-10 py-5 rounded-3xl w-fit flex flex-col justify-center items-center m-auto dark:bg-transparent dark:border-gray-500 border">
            <span className="font-semibold">Education Details</span>
            <Button
              className="flex p-3 rounded-full border border-blue-500 text-blue-500 mt-2 justify-between items-center bg-white dark:bg-blue-950"
              onClick={() => {
                setDialogMode("new");
                setEditingEducation(null);
                setDialogOpen(true);
              }}
            >
              <PlusIcon size={18} /> Add Education
            </Button>
          </div>
        </TabsContent>

        {/* PROJECTS */}
        <TabsContent value="projects" className="mt-4 space-y-4 px-4">
          {/* <h3 className="text-lg font-semibold mb-2">Projects</h3>
          <p className="text-sm text-gray-600">
            Showcase your best work and highlight your achievements.
          </p> */}

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
                      onClick={() => {
                        setDialogOpen(true);
                        setDialogMode("edit");
                        setEditingProject(project); // store selected project
                      }}
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
          <div className="bg-gray-100 px-10 py-5 rounded-3xl w-fit flex flex-col justify-center items-center m-auto dark:bg-transparent dark:border-gray-500 border">
            <span className="font-semibold">Projects</span>
            <button
              className="flex p-3 rounded-full border border-blue-500 text-blue-500 mt-2 justify-between items-center bg-white dark:bg-blue-950"
              onClick={() => {
                setDialogOpen(true);
                setDialogMode("new");
              }}
            >
              <PlusIcon size={18} /> Add Project
            </button>
          </div>

          <ProjectsDialog
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            mode={dialogMode} // "new" or "edit"
            defaultValue={editingProject || {}}
            resumeData={resumeData}
            setResumeData={setResumeData}
          />
        </TabsContent>

        {/* WORK EXPERIENCE */}
        <TabsContent value="work" className="mt-4 space-y-10 px-8">
          {/* <h3 className="text-lg font-semibold mb-2">Work Experience</h3>
          <p className="text-sm text-gray-600">
            List your professional experience.
          </p> */}

          <div className="space-y-3">
            {resumeData?.work_experience?.length > 0 ? (
              resumeData.work_experience.map((job, idx) => (
                <div
                  key={idx}
                  className="relative p-3 border rounded-3xl space-y-1"
                >
                  <p>
                    <strong>{job.job_title}</strong> @ {job.company}
                  </p>
                  <p>{job.duration}</p>
                  <p>{job.responsibilities}</p>

                  {/* Edit / Delete */}
                  <div className="absolute flex gap-2 right-2 top-2 flex-shrink-0">
                    <Button
                      variant="none"
                      className="transition-colors duration-500 size-9 h-8 w-8 text-gray-500 hover:text-blue-600 bg-blue-500/20 flex justify-center items-center rounded-full"
                      onClick={() => {
                        setDialogOpen(true);
                        setDialogMode("edit");
                        setEditingWork(job); // store selected job
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="none"
                      className="transition-colors duration-500 size-9 h-8 w-8 text-gray-500 hover:text-red-600 bg-blue-500/20 flex justify-center items-center rounded-full"
                      onClick={async () => {
                        try {
                          const updatedWork = resumeData.work_experience.filter(
                            (_, i) => i !== idx
                          );
                          await axios.put(
                            `/api/resume-data?resumeId=${resumeData?._id}`,
                            {
                              userId: user._id,
                              work_experience: updatedWork,
                            }
                          );
                          setResumeData((prev) => ({
                            ...prev,
                            work_experience: updatedWork,
                          }));
                          toast.success("Work experience removed!");
                        } catch {
                          toast.error("Failed to delete work experience");
                        }
                      }}
                    >
                      <Trash2Icon size={16} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No work experience added yet.</p>
            )}
          </div>

          {/* Add / Edit Work Dialog */}
          <WorkDialog
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            mode={dialogMode} // "new" or "edit"
            defaultValue={editingWork || {}}
            resumeData={resumeData}
            setResumeData={setResumeData}
            user={user}
          />

          {/* Add button */}
          <div className="bg-gray-100 px-10 py-5 rounded-3xl w-fit flex flex-col justify-center items-center m-auto dark:bg-transparent dark:border-gray-500 border">
            <span className="font-semibold">Work Experience</span>
            <Button
              className="flex p-3 rounded-full border border-blue-500 text-blue-500 mt-2 justify-between items-center bg-white dark:bg-blue-950"
              onClick={() => {
                setDialogMode("new");
                setEditingWork(null);
                setDialogOpen(true);
              }}
            >
              <PlusIcon size={18} /> Add Experience
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ProfileTabs;

function ProjectsDialog({
  dialogOpen,
  setDialogOpen,
  mode, // "new" or "edit"
  defaultValue,
  resumeData,
  setResumeData,
}) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Project" : "Add Project"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const projectData = {
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
              let updatedProjects;
              if (mode === "edit") {
                // Replace the edited project
                updatedProjects = resumeData.projects.map((p) =>
                  p._id === defaultValue._id ? { ...p, ...projectData } : p
                );
              } else {
                // Add new project
                updatedProjects = [
                  ...(resumeData?.projects || []),
                  projectData,
                ];
              }

              await axios.put(`/api/resume-data?resumeId=${resumeData._id}`, {
                projects: updatedProjects,
              });

              setResumeData((prev) => ({
                ...prev,
                projects: updatedProjects,
              }));
              setDialogOpen(false);
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
              defaultValue={defaultValue?.title || ""}
              placeholder="Enter your project title"
              required
            />
          </div>
          <div>
            <Label>Project Link</Label>
            <Input
              name="link"
              defaultValue={defaultValue?.link || ""}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea
              name="description"
              defaultValue={defaultValue?.description || ""}
              placeholder="Brief description of the project"
              required
            />
          </div>
          <div>
            <Label>Technologies</Label>
            <Input
              name="technologies"
              defaultValue={defaultValue?.technologies?.join(", ") || ""}
              placeholder="React, Node.js, Tailwind CSS"
            />
          </div>
          <Button type="submit" className="mt-2">
            {mode === "edit" ? "Update Project" : "Save Project"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function EducationDialog({
  dialogOpen,
  setDialogOpen,
  mode, // "new" or "edit"
  defaultValue,
  resumeData,
  setResumeData,
  user,
  fetchResumeData,
}) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Education" : "Add Education"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const educationData = {
              college_university: formData.get("college_university"),
              degree: formData.get("degree"),
              field_of_study: formData.get("field_of_study"),
              graduation_year: formData.get("graduation_year"),
            };

            try {
              let updatedEducation;
              if (mode === "edit") {
                updatedEducation = resumeData.education.map((edu) =>
                  edu._id === defaultValue._id
                    ? { ...edu, ...educationData }
                    : edu
                );
              } else {
                updatedEducation = [
                  ...(resumeData?.education || []),
                  educationData,
                ];
              }

              await axios.put(`/api/resume-data?resumeId=${resumeData?._id}`, {
                userId: user._id,
                education: updatedEducation,
              });

              setResumeData((prev) => ({
                ...prev,
                education: updatedEducation,
              }));

              toast.success(
                mode === "edit" ? "Education updated!" : "Education added!"
              );
              setDialogOpen(false);
              fetchResumeData();
            } catch {
              toast.error("Failed to save education");
            }
          }}
          className="grid gap-4"
        >
          <div>
            <Label>College / University Name *</Label>
            <Input
              name="college_university"
              defaultValue={defaultValue?.college_university || ""}
              placeholder="Enter your college/university"
              required
            />
          </div>
          <div>
            <Label>Graduation Year *</Label>
            <Input
              name="graduation_year"
              type="number"
              defaultValue={defaultValue?.graduation_year || ""}
              placeholder="e.g. 2025"
              required
            />
          </div>
          <div>
            <Label>Field of Study *</Label>
            <Input
              name="field_of_study"
              defaultValue={defaultValue?.field_of_study || ""}
              placeholder="e.g. Computer Science"
              required
            />
          </div>
          <div>
            <Label>Degree *</Label>
            <Input
              name="degree"
              defaultValue={defaultValue?.degree || ""}
              placeholder="e.g. Bachelor's"
              required
            />
          </div>
          <Button type="submit" className="mt-2">
            {mode === "edit" ? "Update" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
function WorkDialog({
  dialogOpen,
  setDialogOpen,
  mode, // "new" or "edit"
  defaultValue,
  resumeData,
  setResumeData,
  user,
}) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Work Experience" : "Add Work Experience"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const workData = {
              job_title: formData.get("job_title"),
              company: formData.get("company"),
              duration: formData.get("duration"),
              responsibilities: formData.get("responsibilities"),
            };

            try {
              let updatedWork;
              if (mode === "edit") {
                updatedWork = resumeData.work_experience.map((job) =>
                  job._id === defaultValue._id ? { ...job, ...workData } : job
                );
              } else {
                updatedWork = [
                  ...(resumeData?.work_experience || []),
                  workData,
                ];
              }

              await axios.put(`/api/resume-data?resumeId=${resumeData?._id}`, {
                userId: user._id,
                work_experience: updatedWork,
              });

              setResumeData((prev) => ({
                ...prev,
                work_experience: updatedWork,
              }));

              toast.success(
                mode === "edit"
                  ? "Work experience updated!"
                  : "Work experience added!"
              );
              setDialogOpen(false);
            } catch {
              toast.error("Failed to save work experience");
            }
          }}
          className="grid gap-4"
        >
          <div>
            <Label>Job Title *</Label>
            <Input
              name="job_title"
              defaultValue={defaultValue?.job_title || ""}
              placeholder="e.g. Software Engineer"
              required
            />
          </div>
          <div>
            <Label>Company *</Label>
            <Input
              name="company"
              defaultValue={defaultValue?.company || ""}
              placeholder="e.g. Google"
              required
            />
          </div>
          <div>
            <Label>Duration *</Label>
            <Input
              name="duration"
              defaultValue={defaultValue?.duration || ""}
              placeholder="e.g. Jan 2021 - Present"
              required
            />
          </div>
          <div>
            <Label>Responsibilities</Label>
            <Textarea
              name="responsibilities"
              defaultValue={defaultValue?.responsibilities || ""}
              placeholder="Describe your role and achievements"
            />
          </div>
          <Button type="submit" className="mt-2">
            {mode === "edit" ? "Update" : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
