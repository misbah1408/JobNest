import { Upload, Mail, Video, BarChart3 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: "Create Job Posting",
      description: "Create a job posting with all the details",
    },
    {
      icon: Mail,
      title: "Smart Application Process",
      description: "Smart application process with invitation and matching",
    },
    {
      icon: Video,
      title: "AI Interview Session",
      description: "AI Interview Session with video and audio",
    },
    {
      icon: BarChart3,
      title: "Analytics & Results",
      description: "Get detailed analytics and results",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">How it works</h2>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
          Simple, streamlined process from profile to hire in just a few steps.
        </p>
      </div>

      <div className="relative">
        {/* Connecting Line - visible on md and above */}
        <div className="hidden md:block absolute top-10 left-28 w-[85%] h-0.5 bg-white/30 z-0" />

        <div className="flex flex-col md:flex-row items-start justify-between md:gap-1 gap-8 relative z-10">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center relative"
              >
                {/* Icon Circle */}
                <div className="bg-white rounded-full p-6 mb-4 shadow-lg z-10">
                  <IconComponent
                    className="w-8 h-8 text-indigo-600"
                    strokeWidth={2}
                  />
                </div>

                {/* Content */}
                <div className="max-w-xs">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile connecting dots */}
      <div className="flex md:hidden justify-center mt-8 space-x-2">
        {steps.map((_, index) => (
          <div key={index} className="w-2 h-2 bg-white/40 rounded-full" />
        ))}
      </div>
    </div>
  );
}
