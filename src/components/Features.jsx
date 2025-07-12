import {
  Brain,
  ChartColumn,
  FileUp,
  NotebookPen,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import React from "react";

const Features = () => {
  const features = [
    {
      icon: <Brain size={32} />,
      title: "AI-Powered Conversations",
      description:
        "Natural, adaptive interviews that feel genuinely human while maintaining consistency.",
      color: "text-purple-500",
      borderColor: "border-purple-500/20",
      bg_color: "bg-purple-500/10",
    },
    {
      icon: <ChartColumn size={32} />,
      title: "Advanced Analytics",
      description:
        "Deep insights into candidate performance with comprehensive evaluation metrics.",
      color: "text-blue-500",
      borderColor: "border-blue-500/20",
      bg_color: "bg-blue-500/10",
    },
    {
      icon: <Users size={32} />,
      title: "Smart Matching",
      description:
        "Intelligent candidate-job matching based on skills, experience, and cultural fit.",
      color: "text-green-500",
      borderColor: "border-green-500/20",
      bg_color: "bg-green-500/10",
    },
    {
      icon: <NotebookPen size={32} />,
      title: "Smart Resume Processing",
      description:
        "AI instantly extracts and organizes resume data for quick profile creation.",
      color: "text-orange-500",
      borderColor: "border-orange-500/20",
      bg_color: "bg-orange-500/10",
    },
    {
      icon: <Shield size={32} />,
      title: "Bias-Free Evaluation",
      description:
        "Consistent, fair assessment standards that eliminate unconscious bias.",
      color: "text-red-500",
      borderColor: "border-red-500/20",
      bg_color: "bg-red-500/10",
    },
    {
      icon: <Zap size={32} />,
      title: "Instant Feedback",
      description:
        "Real-time performance insights and recommendations for both parties.",
      color: "text-yellow-500",
      borderColor: "red-yellow-500/20",
      bg_color: "bg-yellow-500/20",
    },
  ];
  return (
    <div className="flex flex-col gap-10 ">
      <section className="w-full gap-5 p-8 bg-blue-500/15 border-2 border-blue-500/20 rounded-lg flex flex-col justify-center items-center">
        <span className="px-7 py-3 text-white rounded-full bg-[#3a49cc] flex items-center gap-3 text-lg">
          <Sparkles size={"20px"} />
          Powerful Features
        </span>
        <span className="text-5xl font-primary font-bold text-foreground">
          Everything you need for smart hiring
        </span>
        <p className="text-gradient">
          Advanced AI technology meets intuitive design to create the perfect
          interview experience.
        </p>
      </section>
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features &&
          features.map((ft) => {
            return (
              <div
                key={ft.title}
                className="bg-white dark:bg-black text-card-foreground flex flex-col gap-6 py-6 glass border border-muted/50 shadow-xl transition-all duration-500 rounded-3xl group hover:scale-105 hover:shadow-lg relative overflow-hidden"
              >
                <div className="p-8 space-y-4 relative z-10">
                  <div
                    className={`w-16 h-16 border-2 glass rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${ft.color} border-2 ${ft.borderColor} h-16 w-16 rounded-full ${ft.bg_color} flex justify-center items-center text-4xl`}
                  >
                    {ft.icon}
                  </div>
                  <span className="text-xl font-semibold cursor-default">{ft.title}</span>
                  <p className="leading-relaxed cursor-default">{ft.description}</p>
                </div>
              </div>
            );
          })}
      </section>
    </div>
  );
};

export default Features;
