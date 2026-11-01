import React, { useState, useEffect } from "react";
import { useIncrementView, useProjectView } from "../hooks/useProjectViews";
import { Eye } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Code2,
  Star,
  ChevronRight,
  Layers,
  Layout,
  Globe,
  Package,
  Cpu,
  Code,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import ProjectComments from "./ProjectComments";
import { toSlug } from "../utils/slug";
import { useProjectBySlug } from "../hooks/useProjects";
import { useTheme } from "../context/ThemeContext";

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  return (
    <div className="group relative overflow-hidden px-3 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300 cursor-default">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
      <div className="relative flex items-center gap-1.5 md:gap-2">
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
        <span className="text-xs md:text-sm font-medium text-blue-300/90 group-hover:text-blue-200 transition-colors">
          {tech}
        </span>
      </div>
    </div>
  );
};

const FeatureItem = ({ feature }) => (
  <li className="group flex items-start space-x-3 p-2.5 md:p-3.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-white/10">
    <div className="relative mt-2">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur group-hover:opacity-100 opacity-0 transition-opacity duration-300" />
      <div className="relative w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 group-hover:scale-125 transition-transform duration-300" />
    </div>
    <span className="text-sm md:text-base text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
      {feature}
    </span>
  </li>
);

const ProjectStats = ({ project, viewCount = 0 }) => {
  const techStackCount = project?.technologies?.length || 0;
  const featuresCount = project?.features?.length || 0;

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 p-3 md:p-4 bg-gray-100 dark:bg-[#0a0a1a] rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 opacity-50 blur-2xl z-0" />

      {/* Technologies */}
      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white dark:bg-white/5 p-2 md:p-3 rounded-lg border border-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-500/50">
        <div className="bg-blue-500/20 p-1.5 md:p-2 rounded-full">
          <Code2 className="text-blue-500 dark:text-blue-300 w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-blue-600 dark:text-blue-200">{techStackCount}</div>
          <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Technologies</div>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white dark:bg-white/5 p-2 md:p-3 rounded-lg border border-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/50">
        <div className="bg-purple-500/20 p-1.5 md:p-2 rounded-full">
          <Layers className="text-purple-500 dark:text-purple-300 w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-purple-600 dark:text-purple-200">{featuresCount}</div>
          <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Features</div>
        </div>
      </div>

      {/* Views */}
      <div className="relative z-10 flex items-center space-x-2 md:space-x-3 bg-white dark:bg-white/5 p-2 md:p-3 rounded-lg border border-pink-500/20 transition-all duration-300 hover:scale-105 hover:border-pink-500/50">
        <div className="bg-pink-500/20 p-1.5 md:p-2 rounded-full">
          <Eye className="text-pink-500 dark:text-pink-300 w-4 h-4 md:w-6 md:h-6" strokeWidth={1.5} />
        </div>
        <div className="flex-grow">
          <div className="text-lg md:text-xl font-semibold text-pink-600 dark:text-pink-200">{viewCount}</div>
          <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400">Views</div>
        </div>
      </div>
    </div>
  );
};

const handleGithubClick = (githubLink, isDark) => {
  if (githubLink === "Private") {
    Swal.fire({
      icon: "info",
      title: "Source Code Private",
      text: "Sorry, the source code for this project is private.",
      confirmButtonText: "Got it",
      confirmButtonColor: "#3085d6",
      background: isDark ? "#030014" : "#ffffff",
      color: isDark ? "#ffffff" : "#1f2937",
    });
    return false;
  }
  return true;
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // ✅ React Query
  const { data: project, isLoading, error } = useProjectBySlug(slug);
  const incrementView = useIncrementView();
  const { data: viewData } = useProjectView(project?.id);

  // ✅ increment بازدید فقط یه بار موقع لود
  useEffect(() => {
    if (project?.id) {
      const viewedKey = `viewed_${project.id}`;
      if (!sessionStorage.getItem(viewedKey)) {
        incrementView.mutate(project.id);
        sessionStorage.setItem(viewedKey, "true");
      }
    }
  }, [project?.id]);

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#030014] flex items-center justify-center">
        <div className="text-center space-y-6">
          <Loader2 className="w-16 h-16 md:w-24 md:h-24 mx-auto text-blue-500 animate-spin" />
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Loading Project...
          </h2>
        </div>
      </div>
    );
  }

  // ✅ Error State
  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#030014] flex items-center justify-center px-5">
        <div className="text-center space-y-6 max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
          <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white">
            Project Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const projectUrl = `https://ekizr.com/project/${toSlug(project.title)}`;

  return (
    <>
      <Helmet>
        <title>{project.title} — yakoob khedri</title>
        <meta
          name="description"
          content={
            project.description
              ? project.description.slice(0, 155)
              : `Project ${project.title} by Eki Zulfar Rachman.`
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={projectUrl} />
        <meta property="og:title" content={`${project.title} — Eki Zulfar Rachman`} />
        <meta property="og:description" content={project.description?.slice(0, 155)} />
        <meta property="og:url" content={projectUrl} />
        <meta property="og:type" content="website" />
        {project.image_url && <meta property="og:image" content={project.image_url} />}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": "${project.title}",
            "description": "${project.description?.replace(/"/g, '\\"')}",
            "url": "${projectUrl}",
            "author": {
              "@type": "Person",
              "name": "yakoob khedri",
              "url": "https://ekizr.com"
            }
          }
        `}</script>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-[#030014] px-[2%] sm:px-0 relative overflow-hidden">
        {/* Background blobs */}
        <div className="fixed inset-0">
          <div className="absolute -inset-[10px] opacity-20">
            <div className="absolute top-0 -left-4 w-72 md:w-96 h-72 md:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 md:w-96 h-72 md:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 md:w-96 h-72 md:h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
          </div>
        </div>

        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-16">
            {/* Back Button */}
            <div className="flex items-center space-x-2 md:space-x-4 mb-8 md:mb-12">
              <button
                onClick={() => navigate(-1)}
                className="group inline-flex items-center space-x-1.5 md:space-x-2 px-3 md:px-5 py-2 md:py-2.5 bg-white dark:bg-white/5 backdrop-blur-xl rounded-xl text-gray-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-sm md:text-base"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <div className="flex items-center space-x-1 md:space-x-2 text-sm md:text-base text-gray-500 dark:text-white/50">
                <span>Projects</span>
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-gray-800 dark:text-white/90 truncate">{project.title}</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
              {/* Left Column */}
              <div className="space-y-6 md:space-y-10">
                <div className="space-y-4 md:space-y-6">
                  <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-200 dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent leading-tight">
                    {project.title}
                  </h1>
                  <div className="relative h-1 w-16 md:w-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm" />
                  </div>
                </div>

                <div className="prose max-w-none">
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-300/90 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <ProjectStats project={project} viewCount={viewData?.view_count || 0} />

                {/* Buttons */}
                <div className="flex flex-wrap gap-3 md:gap-4">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-xl transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                    >
                      <ExternalLink className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                      <span className="relative font-medium">Live Demo</span>
                    </a>
                  )}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center space-x-1.5 md:space-x-2 px-4 md:px-8 py-2.5 md:py-4 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 rounded-xl transition-all duration-300 border border-purple-500/20 hover:border-purple-500/40 backdrop-blur-xl overflow-hidden text-sm md:text-base"
                      onClick={(e) =>
                        !handleGithubClick(project.github_url, isDark) && e.preventDefault()
                      }
                    >
                      <Github className="relative w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                      <span className="relative font-medium">Github</span>
                    </a>
                  )}
                </div>

                {/* Technologies */}
                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2 md:gap-3">
                    <Code2 className="w-4 h-4 md:w-5 md:h-5 text-blue-500 dark:text-blue-400" />
                    Technologies Used
                  </h3>
                  {project.technologies?.length > 0 ? (
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {project.technologies.map((tech, index) => (
                        <TechBadge key={index} tech={tech} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 opacity-50">
                      No technologies added.
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 md:space-y-10">
                <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl group">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full object-cover transform transition-transform duration-700 will-change-transform group-hover:scale-105"
                    onLoad={() => setIsImageLoaded(true)}
                  />
                </div>

                <div className="bg-white dark:bg-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-white/10 space-y-6 hover:border-gray-300 dark:hover:border-white/20 transition-colors duration-300 group">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white/90 flex items-center gap-3">
                    <Star className="w-5 h-5 text-yellow-400 group-hover:rotate-[20deg] transition-transform duration-300" />
                    Key Features
                  </h3>
                  {project.features?.length > 0 ? (
                    <ul className="list-none space-y-2">
                      {project.features.map((feature, index) => (
                        <FeatureItem key={index} feature={feature} />
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 opacity-50">
                      No features added.
                    </p>
                  )}
                </div>

                {/* Comments Section */}
                <div className="mt-6">
                  <ProjectComments projectId={project.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;