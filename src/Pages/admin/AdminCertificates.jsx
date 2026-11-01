import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { confirmAlert, successAlert, errorAlert } from "../../utils/alerts";
import {
    Award,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    AlertCircle,
    Search,
} from "lucide-react";
import {
    useCertificates,
    useAddCertificate,
    useUpdateCertificate,
    useDeleteCertificate
} from "../../hooks/useCertificates";
import CertificateForm from "../../components/CertificateForm";
import { Modal } from "../../components/ui/Modal";

const AdminCertificates = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingCertificate, setEditingCertificate] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: certificates = [], isLoading, error } = useCertificates();
    const addCertificate = useAddCertificate();
    const updateCertificate = useUpdateCertificate();
    const deleteCertificate = useDeleteCertificate();

    const filteredCertificates = useMemo(() => {
        if (!searchTerm) return certificates;
        const search = searchTerm.toLowerCase();
        return certificates.filter(
            (c) =>
                c.title?.toLowerCase().includes(search) ||
                c.issuer?.toLowerCase().includes(search)
        );
    }, [certificates, searchTerm]);

    const handleAddClick = () => {
        setEditingCertificate(null);
        setShowForm(true);
    };

    const handleEditClick = (certificate) => {
        setEditingCertificate(certificate);
        setShowForm(true);
    };

    const handleDeleteClick = async (certificate) => {
        const confirmed = await confirmAlert(
            "Delete Certificate?",
            `Are you sure you want to delete "${certificate.title}"?`
        );

        if (confirmed) {
            deleteCertificate.mutate(certificate.id, {
                onSuccess: () => successAlert("Deleted!", "Certificate has been deleted."),
                onError: () => errorAlert("Error", "Failed to delete certificate."),
            });
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            if (editingCertificate) {
                await updateCertificate.mutateAsync({
                    id: editingCertificate.id,
                    updates: data,
                });
                successAlert("Updated!", "Certificate has been updated.");
            } else {
                await addCertificate.mutateAsync(data);
                successAlert("Created!", "Certificate has been created.");
            }
            setShowForm(false);
            setEditingCertificate(null);
        } catch (error) {
            console.error("Error saving certificate:", error);
            errorAlert("Error", "Failed to save certificate.");
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingCertificate(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                    <p className="text-gray-500 dark:text-gray-400">Loading certificates...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#030014] px-5">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Error Loading Certificates
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">{error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Manage Certificates — Admin Panel</title>
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
                                <Award className="w-8 h-8 text-purple-500" />
                                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                                    Certificates
                                </h1>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage all your certificates and achievements.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleAddClick}
                                className="flex items-center relative z-30 gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-medium transition-all hover:scale-105"
                            >
                                <Plus className="w-4 h-4" />
                                Add Certificate
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
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search certificates..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                    </div>
                </motion.div>

                {/* Certificates List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-30"
                >
                    {filteredCertificates.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                No certificates found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchTerm
                                    ? "Try a different search term."
                                    : "Click 'Add Certificate' to create your first certificate."}
                            </p>
                        </div>
                    ) : (
                        filteredCertificates.map((certificate) => (
                            <div
                                key={certificate.id}
                                className="bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-purple-500/30 transition-all group"
                            >
                                {/* Image */}
                                <div className="aspect-video bg-gray-100 dark:bg-white/5 overflow-hidden">
                                    {certificate.image_url ? (
                                        <img
                                            src={certificate.image_url}
                                            alt={certificate.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Award className="w-12 h-12 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 dark:text-white truncate mb-1">
                                        {certificate.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                        {certificate.issuer}
                                    </p>
                                    {certificate.date && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                                            {new Date(certificate.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                            })}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-white/5">
                                        <button
                                            onClick={() => handleEditClick(certificate)}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-all text-sm"
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(certificate)}
                                            disabled={deleteCertificate.isPending}
                                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all text-sm disabled:opacity-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
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
                    <Modal.Header title={editingCertificate ? "Edit Certificate" : "Add New Certificate"} />
                    <Modal.Body>
                        <CertificateForm
                            certificate={editingCertificate}
                            onSubmit={handleFormSubmit}
                            onCancel={handleCancelForm}
                            isSubmitting={addCertificate.isPending || updateCertificate.isPending}
                        />
                    </Modal.Body>
                </Modal.Container>
            </Modal>
        </>
    );
};

export default AdminCertificates;