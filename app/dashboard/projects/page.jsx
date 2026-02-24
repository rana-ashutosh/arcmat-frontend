'use client';

import { useState, useEffect } from 'react';
import { useGetProjects } from '@/hooks/useProject';
import ProjectCard from '@/components/dashboard/projects/ProjectCard';
import useAuthStore from '@/store/useAuthStore';
import { Grid, List, Search, Filter, Loader2, Plus, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import CreateProjectModal from '@/components/dashboard/sidebar/CreateProjectModal';
import { useDeleteProject } from '@/hooks/useProject';
import { toast } from '@/components/ui/Toast';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function AllProjectsPage() {
    const { user } = useAuthStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [mounted, setMounted] = useState(false);

    const deleteProjectMutation = useDeleteProject();

    useEffect(() => {
        setMounted(true);
    }, []);

    const { data: projectsData, isLoading } = useGetProjects({
        enabled: mounted && !!user
    });

    const projects = projectsData?.data || [];

    const handleEdit = (project) => {
        setEditingProject(project);
        setIsProjectModalOpen(true);
    };

    const handleDeleteClick = (project) => {
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (projectToDelete) {
            deleteProjectMutation.mutate(projectToDelete._id);
            setProjectToDelete(null);
        }
    };

    const closeProjectModal = () => {
        setIsProjectModalOpen(false);
        setEditingProject(null);
    };

    const filteredProjects = projects.filter(project =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!mounted) return null;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-[#2d3142] mb-2 tracking-tight">
                        All Projects
                    </h1>
                    <p className="text-gray-400 font-medium">
                        Manage and track all your architectural projects in one place.
                    </p>
                </div>
                <Button
                    onClick={() => setIsProjectModalOpen(true)}
                    className="bg-[#d9a88a] hover:bg-white border hover:border-[#d9a88a] text-white hover:text-[#d9a88a] px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 shrink-0"
                >
                    <Plus className="w-5 h-5" />
                    New Project
                </Button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search projects by name or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-[#f3f4f6] border-transparent focus:bg-white focus:border-[#d9a88a] focus:ring-0 rounded-2xl transition-all text-gray-600 font-medium"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <Loader2 className="w-12 h-12 text-[#d9a88a] animate-spin mb-4" />
                    <p className="text-gray-400 font-bold text-lg">Loading your projects...</p>
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                            onEdit={handleEdit}
                            onDelete={() => handleDeleteClick(project)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200 text-center">
                    <div className="w-24 h-24 bg-[#fef7f2] rounded-3xl flex items-center justify-center mb-8">
                        <Plus className="w-12 h-12 text-[#d9a88a]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#2d3142] mb-3">No projects found</h3>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto mb-10">
                        {searchTerm
                            ? "We couldn't find any projects matching your search term. Try another word?"
                            : "You haven't created any projects yet. Start by creating your first project!"}
                    </p>
                </div>
            )}

            <CreateProjectModal
                isOpen={isProjectModalOpen}
                onClose={closeProjectModal}
                project={editingProject}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Project"
                message={`Are you sure you want to delete "${projectToDelete?.projectName}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
}
