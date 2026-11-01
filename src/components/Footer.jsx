import { Link } from "react-router-dom";
import { 
  Github, 
  Linkedin, 
  Instagram, 
  Mail, 
  MapPin, 
  Heart,
  ArrowUp,
  FileText
} from "lucide-react";
import { useSiteSettings } from "../hooks/useSiteSettings";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data: settings } = useSiteSettings();

  const socialLinks = [
    { 
      icon: Github, 
      url: settings?.github_url, 
      label: "GitHub" 
    },
    { 
      icon: Linkedin, 
      url: settings?.linkedin_url, 
      label: "LinkedIn" 
    },
    { 
      icon: Instagram, 
      url: settings?.instagram_url, 
      label: "Instagram" 
    },
  ].filter((link) => link.url);

  const quickLinks = [
    { href: "#Home", label: "Home" },
    { href: "#About", label: "About" },
    { href: "#Portofolio", label: "Portfolio" },
    { href: "#Contact", label: "Contact" },
  ];

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollToSection = (e, href) => {
    e.preventDefault();
    const section = document.querySelector(href);
    if (section) {
      const top = section.offsetTop - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-gray-50 dark:bg-[#030014] border-t border-gray-200 dark:border-white/10 mt-20">
      {/* Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

      <div className="px-[5%] lg:px-[10%] py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent inline-block mb-4"
            >
              {settings?.site_name?.split(" ")[0] || "EkiZR"}
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              {settings?.site_description || "Frontend Developer creating innovative and user-friendly web experiences."}
            </p>
            {settings?.cv_url && (
              <a
                href={settings.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white text-sm font-medium transition-all hover:scale-105"
              >
                <FileText className="w-4 h-4" />
                Download CV
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => handleScrollToSection(e, link.href)}
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 text-sm transition-colors relative group"
                  >
                    <span className="relative">
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-indigo-500 transition-all duration-300 group-hover:w-full" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              {settings?.email && (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="flex items-start gap-3 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 text-sm transition-colors group"
                  >
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="break-all">{settings.email}</span>
                  </a>
                </li>
              )}
              {settings?.location && (
                <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{settings.location}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Follow Me
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialLinks.length > 0 ? (
                socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group relative p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-indigo-500/50 transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl opacity-0 group-hover:opacity-20 transition-opacity" />
                    <social.icon className="relative w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
                  </a>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  No social links added
                </p>
              )}
            </div>
            {settings?.availability && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {settings.availability}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
              © {currentYear}{" "}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {settings?.site_name || "EkiZR"}
              </span>
              . All rights reserved.
            </p>

            {/* Made with */}
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              Made with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />{" "}
              using React
            </p>

            {/* Back to Top */}
            <button
              onClick={handleScrollToTop}
              className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 text-sm transition-all"
              aria-label="Back to top"
            >
              Back to Top
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;