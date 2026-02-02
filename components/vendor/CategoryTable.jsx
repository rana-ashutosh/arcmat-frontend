import { useMemo } from 'react';
import { Pencil, Trash2, ChevronRight, Hash, FolderTree, Folder, Tag } from 'lucide-react';
import clsx from 'clsx';
import { buildCategoryTree } from '@/lib/categoryUtils';

const CategoryItem = ({ category, level, onEdit, onDelete }) => {
    const isL1 = level === 1;
    const isL2 = level === 2;
    const isL3 = level === 3;

    return (
        <div className={clsx(
            "relative",
            isL1 && "mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden",
            isL2 && "mt-3 ml-6 md:ml-10 bg-gray-50/50 rounded-xl border border-gray-200/60 p-1",
            isL3 && "mt-2 ml-6 md:ml-8 flex items-center gap-3 py-2 px-3 border-l-2 border-gray-200 hover:border-[#e09a74] transition-colors"
        )}>
            {/* Context Line for L2/L3 relationship visualization */}
            {(isL2 || isL3) && (
                <div className="absolute -left-4 top-4 w-4 h-px bg-gray-300 md:-left-6"></div>
            )}

            {/* Header / Content Row */}
            <div className={clsx(
                "flex items-center justify-between gap-4",
                isL1 && "p-5 bg-white",
                isL2 && "p-3",
                isL3 && "w-full"
            )}>
                {/* Left Side: Icon & Info */}
                <div className="flex items-center gap-3 md:gap-4 flex-1">
                    {/* Icon Box */}
                    <div className={clsx(
                        "shrink-0 flex items-center justify-center rounded-lg font-bold border",
                        isL1 && "w-12 h-12 bg-orange-50 text-orange-600 border-orange-100",
                        isL2 && "w-9 h-9 bg-white text-blue-600 border-gray-200 shadow-sm",
                        isL3 && "w-7 h-7 bg-transparent text-gray-500 border-transparent"
                    )}>
                        {isL1 && <FolderTree className="w-6 h-6" />}
                        {isL2 && <Folder className="w-5 h-5" />}
                        {isL3 && <Tag className="w-4 h-4" />}
                    </div>

                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className={clsx(
                                "font-bold text-gray-900",
                                isL1 && "text-lg",
                                isL2 && "text-sm",
                                isL3 && "text-sm"
                            )}>
                                {category.name}
                            </span>

                            {/* Status Badge */}
                            <span className={clsx(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                                (category.isActive === 0 || category.isActive === false)
                                    ? "bg-red-50 text-red-600 border-red-100"
                                    : "bg-green-50 text-green-600 border-green-100"
                            )}>
                                {(category.isActive === 0 || category.isActive === false) ? 'Inactive' : 'Active'}
                            </span>
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-1.5 rounded">{category.slug}</span>
                            {/* <span className="text-[10px] text-gray-400 font-medium">ID: {category.categoryId}</span> */}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(category)}
                        className="p-2 text-gray-400 hover:text-[#e09a74] hover:bg-orange-50 rounded-lg transition-all"
                        title="Edit Category"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(category)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Category"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Recursively render children */}
            {category.children && category.children.length > 0 && (
                <div className={clsx(
                    isL1 && "border-t border-gray-100 bg-gray-50/30 p-4 pt-1", // L1 Container Body
                )}>
                    {category.children.map(child => (
                        <CategoryItem
                            key={child._id}
                            category={child}
                            level={level + 1}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function CategoryTable({ categories, onEdit, onDelete }) {
    // Transform flat list to tree
    const categoryTree = useMemo(() => buildCategoryTree(categories), [categories]);

    if (!categories || categories.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500 font-medium">No categories found matching your search.</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {/* Header Helper (Optional, user wanted hierarchy so headers might be less relevant, but maybe a total count?) */}
            <div className="flex items-center justify-between px-2 mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Structure & Hierarchy ({categories.length} items)
                </span>
            </div>

            {categoryTree.map(root => (
                <CategoryItem
                    key={root._id}
                    category={root}
                    level={1}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
