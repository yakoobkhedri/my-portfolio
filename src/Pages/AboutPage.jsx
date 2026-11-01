import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Code2,
  Award,
  MapPin,
  Mail,
  Calendar,
  Download,
  Github,
  Linkedin,
  Instagram,
  ExternalLink
} from "lucide-react";

const AboutPage = () => {
  const skills = [
    { name: "React", level: 90 },
    { name: "JavaScript", level: 85 },
    { name: "Tailwind CSS", level: 88 },
    { name: "Supabase", level: 80 },
    { name: "Git & GitHub", level: 85 },
  ];

  const education = [
    {
      degree: "Bachelor of Computer Science",
      institution: "University of Urmia",
      year: "2020 - 2024",
      description: "Focused on software engineering and web development.",
    },
    {
      degree: "High School Diploma",
      institution: "Allameh Helli High School",
      year: "2016 - 2020",
      description: "Mathematics and Physics track.",
    },
  ];

  const experience = [
    {
      role: "Frontend Developer",
      company: "Freelance",
      year: "2023 - Present",
      description: "Building responsive and modern web applications using React, Tailwind CSS, and Supabase.",
    },
    {
      role: "Junior Web Developer",
      company: "Tech Company",
      year: "2022 - 2023",
      description: "Developed and maintained frontend features for client projects.",
    },
  ];

  const socialLinks = [
    { icon: Github, link: "https://github.com/yakoobkhedri/", label: "GitHub" },
    { icon: Linkedin, link: "https://www.linkedin.com/in/yakoob-khedri-b20478145", label: "LinkedIn" },
    { icon: Instagram, link: "https://www.instagram.com/yaeghoob1371", label: "Instagram" },
  ];

  return (
    <>
      <Helmet>
        <title>About — Yakoob khedri</title>
        <meta name="description" content="Learn more about Eki Zulfar Rachman, Frontend Developer." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-[#030014] px-[5%] lg:px-[10%] pt-28 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent mb-4">
            About Me
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get to know me better — my journey, skills, and what drives me.
          </p>
        </motion.div>

        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-10 mb-20 relative z-30"
        >
          <div className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Hello, I'm yakoob khedri 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              I'm a Network & Telecommunications student with a deep passion for Frontend Development.
              I love creating modern, user-friendly web experiences that make a difference.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              My journey in web development started with curiosity and turned into a career path.
              I'm constantly learning new technologies and improving my craft.
            </p>

            {/* Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <span>Iran</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Mail className="w-5 h-5 text-indigo-500" />
                <span>yakkobkhedrii@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                <Calendar className="w-5 h-5 text-indigo-500" />
                <span>Available for freelance</span>
              </div>
            </div>

            {/* Social + CV */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </a>
              ))}
              <a
                href="https://github.com/yakoobkhedri/"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white text-sm font-medium transition-all hover:scale-105"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-8 border border-gray-200 dark:border-white/10 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Code2 className="w-6 h-6 text-indigo-500" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Skills</h2>
            </div>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {skill.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="w-6 h-6 text-indigo-500" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Experience</h2>
          </div>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 pb-6 border-l-2 border-gray-200 dark:border-white/10 last:border-0"
              >
                <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7]" />
                <div className="bg-white dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/10">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {exp.role}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {exp.year}
                    </span>
                  </div>
                  <p className="text-indigo-500 font-medium mb-2">{exp.company}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <GraduationCap className="w-6 h-6 text-indigo-500" />
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Education</h2>
          </div>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 pb-6 border-l-2 border-gray-200 dark:border-white/10 last:border-0"
              >
                <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7]" />
                <div className="bg-white dark:bg-white/5 rounded-xl p-6 border border-gray-200 dark:border-white/10">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {edu.degree}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {edu.year}
                    </span>
                  </div>
                  <p className="text-indigo-500 font-medium mb-2">{edu.institution}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {edu.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AboutPage;