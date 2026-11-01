import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight, Eye } from "lucide-react";
import { toSlug } from "../utils/slug";

const CardProject = ({ Img, Title, Description, Link: ProjectLink, id, category, viewCount = 0 }) => {
  const handleLiveDemo = (e) => {
    if (!ProjectLink) {
      e.preventDefault();
      alert("Live demo link is not available");
    }
  };

  const handleDetails = (e) => {
    if (!id) {
      e.preventDefault();
      alert("Project details are not available");
    }
  };

  return (
    <div className="group relative w-full">
      <div className="relative overflow-hidden rounded-xl 
                      bg-white dark:bg-gradient-to-br dark:from-slate-900/90 dark:to-slate-800/90 
                      border border-gray-200 dark:border-white/10 
                      shadow-lg dark:shadow-2xl 
                      transition-all duration-300 
                      hover:shadow-purple-500/20">

        {/* گرادیانت پس‌زمینه - فقط توی دارک مود */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 dark:opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

        <div className="relative p-5 z-10">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={Img}
              alt={Title}
              className="w-full h-full object-cover aspect-[16/8] transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="mt-4 space-y-3">
            <h3 className="text-xl font-semibold 
                           text-gray-800 dark:text-transparent 
                           dark:bg-gradient-to-r dark:from-blue-200 dark:via-purple-200 dark:to-pink-200 dark:bg-clip-text">
              {Title}
              {category && (
                <span className="inline-block px-2 py-1 text-xs rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                  {category}
                </span>
              )}
            </h3>

            <p className="text-gray-600 dark:text-gray-300/80 text-sm leading-relaxed line-clamp-2">
              {Description}
            </p>

            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Eye className="w-3.5 h-3.5" />
                <span>{viewCount}</span>
              </div>
              {ProjectLink ? (
                <a
                  href={ProjectLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleLiveDemo}
                  className="inline-flex items-center space-x-2 
                             text-blue-600 dark:text-blue-400 
                             hover:text-blue-700 dark:hover:text-blue-300 
                             transition-colors duration-200"
                >
                  <span className="text-sm font-medium">Live Demo</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  Demo Not Available
                </span>
              )}

              {id ? (
                <Link
                  to={`/project/${toSlug(Title)}`}
                  onClick={handleDetails}
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg 
                             bg-gray-100 hover:bg-gray-200 text-gray-800 
                             dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/90 
                             transition-all duration-200 hover:scale-105 active:scale-95 
                             focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <span className="text-sm font-medium">Details</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  Details Not Available
                </span>
              )}
            </div>
          </div>

          <div className="absolute inset-0 border border-transparent group-hover:border-purple-500/50 rounded-xl transition-colors duration-300 -z-50"></div>
        </div>
      </div>
    </div>
  );
};

import { memo } from "react";

export default memo(CardProject);