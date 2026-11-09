import React, { useState, useCallback, useMemo } from "react";
import { useProjectViews } from "../hooks/useProjectViews";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Commentar from "../components/Commentar";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes, Loader2 } from "lucide-react";
import { useProjects } from "../hooks/useProjects";
import { useCertificates } from "../hooks/useCertificates";
import SearchAndFilter from "../components/SearchAndFilter";
import { useFilteredProjects } from "../hooks/useProjects";
import ProjectCardSkeleton from "../components/skeletons/ProjectCardSkeleton";
import CertificateSkeleton from "../components/skeletons/CertificateSkeleton";

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 
               text-gray-700 dark:text-slate-300 
               hover:text-gray-900 dark:hover:text-white 
               text-sm font-medium 
               transition-all duration-300 ease-in-out
               flex items-center gap-2
               bg-gray-100 dark:bg-white/5 
               hover:bg-gray-200 dark:hover:bg-white/10
               rounded-md
               border border-gray-300 dark:border-white/10
               hover:border-gray-400 dark:hover:border-white/20
               backdrop-blur-sm
               group relative overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [value, setValue] = useState(0);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // ✅ React Query hooks
  const {
    data: projects = [],
    isLoading: isLoadingProjects,
    error: projectsError
  } = useProjects();

  const {
    data: certificates = [],
    isLoading: isLoadingCertificates,
    error: certificatesError
  } = useCertificates();

  const { data: viewsMap = {} } = useProjectViews();

  const isLoading = isLoadingProjects || isLoadingCertificates;
  const error = projectsError || certificatesError;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  // ✅ استخراج دسته‌بندی‌های یکتا
  const categories = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    const uniqueCategories = [...new Set(
      projects
        .map(p => p.category)
        .filter(Boolean)
    )];
    return uniqueCategories;
  }, [projects]);

  // ✅ فیلتر پروژه‌ها با جستجو و دسته‌بندی
  const filteredProjects = useFilteredProjects(projects, searchTerm, selectedCategory);
  const displayedProjects = showAllProjects ? filteredProjects : filteredProjects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);
  
  // ✅ نمایش وضعیت لودینگ
  if (isLoading) {
    return (
      <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-gray-50 dark:bg-[#030014] overflow-hidden" id="Portofolio">
        {/* Header Skeleton */}
        <div className="text-center pb-10">
          <div className="h-12 w-64 mx-auto bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-4" />
          <div className="h-4 w-96 mx-auto bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
        </div>

        {/* Tabs Skeleton */}
        <div className="h-16 bg-gray-200 dark:bg-white/10 rounded-2xl animate-pulse mb-6" />

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ✅ نمایش خطا
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014]">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 text-lg mb-2">Error loading data</p>
          <p className="text-gray-600 dark:text-slate-400 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-gray-50 dark:bg-[#030014] overflow-hidden" id="Portofolio">
      {/* Header section */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span style={{
            color: '#6366f1',
            backgroundImage: 'linear-gradient(45deg, #6366f1 10%, #a855f7 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, and technical expertise.
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: isDark ? "#94a3b8" : "#64748b",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: isDark ? "#ffffff" : "#1e293b",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                },
                "&.Mui-selected": {
                  color: isDark ? "#fff" : "#1e293b",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                },
              },
              "& .MuiTabs-indicator": { height: 0 },
              "& .MuiTabs-flexContainer": { gap: "8px" },
            }}
          >
            <Tab icon={<Code className="mb-2 w-5 h-5" />} label="Projects" {...a11yProps(0)} />
            <Tab icon={<Award className="mb-2 w-5 h-5" />} label="Certificates" {...a11yProps(1)} />
            <Tab icon={<Boxes className="mb-2 w-5 h-5" />} label="Tech Stack" {...a11yProps(2)} />
          </Tabs>
        </AppBar>

        <div>
          <TabPanel value={value} index={0} dir={theme.direction}>
            {/* ✅ Search & Filter */}
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              category={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              resultCount={filteredProjects.length}
            />
            <div className="container mx-auto overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject
                      Img={project.image_url}
                      Title={project.title}
                      Description={project.description}
                      Link={project.live_url}
                      id={project.id}
                      category={project.category}
                      viewCount={viewsMap[project.id] || 0}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )} */}
            {/* پیام "چیزی پیدا نشد" */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  No projects found matching your search.
                </p>
              </div>
            )}

            {/* دکمه See More */}
            {filteredProjects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={certificate.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <Certificate ImgSertif={certificate.image_url} />
                  </div>
                ))}
              </div>
            </div>
            {certificates.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('certificates')}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </div>
      </Box>
    </div>
  );
}