'use client';

import { MapPin, Calendar, Layout, Info, User, IndianRupee, Edit2, Trash2 } from 'lucide-react';

export default function ProjectCard({ project, onEdit, onDelete }) {
    const {
        projectName,
        type,
        phase,
        location,
        budget,
        description,
        createdAt,
        estimatedDuration
    } = project;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getMonthName = (monthNum) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[parseInt(monthNum) - 1] || monthNum;
    };

    return (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-300 group relative">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#2d3142] group-hover:text-[#d9a88a] transition-colors">
                        {projectName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
                        <MapPin className="w-4 h-4" />
                        <span>{location.city}, {location.country}</span>
                    </div>
                </div>
                <div className="px-3 py-1 bg-[#fef7f2] text-[#d9a88a] rounded-full text-xs font-bold uppercase tracking-wider">
                    {type}
                </div>
            </div>

            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => onEdit(project)}
                    className="p-2 bg-white shadow-md rounded-xl text-[#d9a88a] hover:bg-[#d9a88a] hover:text-white transition-all transform hover:scale-110"
                    title="Edit project"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete(project._id)}
                    className="p-2 bg-white shadow-md rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                    title="Delete project"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Phase</span>
                    <div className="flex items-center gap-2 text-sm text-gray-700 font-semibold">
                        <Layout className="w-4 h-4 text-[#d9a88a]" />
                        {phase}
                    </div>
                </div>
                <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Budget</span>
                    <div className="flex items-center gap-1 text-sm text-gray-700 font-semibold">
                        <IndianRupee className="w-3.5 h-3.5 text-[#d9a88a]" />
                        {budget}
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] font-medium text-gray-400">
                <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created: {formatDate(createdAt)}</span>
                </div>
                {estimatedDuration && (
                    <div className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>End: {getMonthName(estimatedDuration.month)} {estimatedDuration.year}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
