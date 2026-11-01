import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { toSlug } from "../../utils/slug";
import { Modal } from "../../components/ui/Modal";
import { confirmAlert, successAlert, errorAlert } from "../../utils/alerts";
import { motion } from "framer-motion";
import {
    FolderKanban,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    AlertCircle,
    Search,
    Eye
} from "lucide-react";
import {
    useProjects,
    useAddProject,
    useUpdateProject,
    useDeleteProject
} from "../../hooks/useProjects";
import ProjectForm from "../../components/ProjectForm";
import { Link } from "react-router-dom";
import TableSkeleton from "../../components/skeletons/TableSkeleton";

const AdminProjects = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: projects = [], isLoading, error } = useProjects();
    const addProject = useAddProject();
    const updateProject = useUpdateProject();
    const deleteProject = useDeleteProject();

    // فیلتر
    const filteredProjects = useMemo(() => {
        if (!searchTerm) return projects;
        const search = searchTerm.toLowerCase();
        return projects.filter(
            (p) =>
                p.title?.toLowerCase().includes(search) ||
                p.category?.toLowerCase().includes(search) ||
                p.description?.toLowerCase().includes(search)
        );
    }, [projects, searchTerm]);

    const handleAddClick = () => {
        setEditingProject(null);
        setShowForm(true);
    };

    const handleEditClick = (project) => {
        setEditingProject(project);
        setShowForm(true);
    };

    const handleDeleteClick = async (project) => {
        const confirmed = await confirmAlert(
            "Delete Project?",
            `Are you sure you want to delete "${project.title}"? This action cannot be undone.`
        );

        if (confirmed) {
            deleteProject.mutate(project.id, {
                onSuccess: () => successAlert("Deleted!", "Project has been deleted successfully."),
                onError: () => errorAlert("Error", "Failed to delete project. Please try again."),
            });
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            if (editingProject) {
                await updateProject.mutateAsync({
                    id: editingProject.id,
                    updates: data,
                });
                successAlert("Updated!", "Project has been updated successfully.");
            } else {
                await addProject.mutateAsync(data);
                successAlert("Created!", "Project has been created successfully.");
            }
            setShowForm(false);
            setEditingProject(null);
        } catch (error) {
            console.error("Error saving project:", error);
            errorAlert("Error", "Failed to save project. Please try again.");
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingProject(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#030014] px-[5%] lg:px-[10%] pt-28 pb-20">
                <div className="mb-8">
                    <div className="h-12 w-64 bg-gray-200 dark:bg-white/10 rounded-lg animate-pulse mb-4" />
                    <div className="h-4 w-96 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
                </div>
                <TableSkeleton rows={5} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014] px-5">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Error Loading Projects
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Manage Projects — Admin Panel</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="min-h-screen bg-gray-50 dark:bg-[#030014] px-[5%] lg:px-[10%] pt-28 pb-20">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <FolderKanban className="w-8 h-8 text-indigo-500" />
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                                    Projects
                                </h1>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage all your portfolio projects.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleAddClick}
                                className="flex items-center relative z-30 gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all hover:scale-105"
                            >
                                <Plus className="w-4 h-4" />
                                Add Project
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search projects..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>
                </motion.div>

                {/* Projects List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3 relative z-30"
                >
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                            <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                No projects found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchTerm
                                    ? "Try a different search term."
                                    : "Click 'Add Project' to create your first project."}
                            </p>
                        </div>
                    ) : (
                        filteredProjects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-200 dark:border-white/10 hover:border-indigo-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Image */}
                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 flex-shrink-0">
                                        {project.image_url ? (
                                            <img
                                                src={project.image_url}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FolderKanban className="w-8 h-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                            {project.description}
                                        </p>
                                        {project.category && (
                                            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-600 dark:text-indigo-300">
                                                {project.category}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={`/project/${toSlug(project.title)}`}
                                            className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 transition-all"
                                            aria-label="View"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleEditClick(project)}
                                            className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-all"
                                            aria-label="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(project)}
                                            disabled={deleteProject.isPending}
                                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all disabled:opacity-50"
                                            aria-label="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </motion.div>
            </div>

            {/* ✅ Modal */}
            <Modal isOpen={showForm} onClose={handleCancelForm}>
                <Modal.Container>
                    <Modal.Header title={editingProject ? "Edit Project" : "Add New Project"} />
                    <Modal.Body>
                        <ProjectForm
                            project={editingProject}
                            onSubmit={handleFormSubmit}
                            onCancel={handleCancelForm}
                            isSubmitting={addProject.isPending || updateProject.isPending}
                        />
                    </Modal.Body>
                </Modal.Container>
            </Modal>
        </>
    );
};

export default AdminProjects;