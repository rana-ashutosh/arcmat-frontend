
/**
 * Builds a hierarchical tree from a flat list of categories.
 * 
 * @param {Array} categories - The flat array of category objects.
 * @returns {Array} - The root level categories with nested 'children' arrays.
 */
export const buildCategoryTree = (categories) => {
    if (!categories || categories.length === 0) return [];

    const categoryMap = new Map();
    const roots = [];

    // 1. Initialize map and children array for each category
    categories.forEach(cat => {
        categoryMap.set(cat._id, { ...cat, children: [] });
    });

    // 2. Build tree
    categories.forEach(cat => {
        if (cat.parentId && categoryMap.has(cat.parentId)) {
            // It's a child, add to parent's children
            const parent = categoryMap.get(cat.parentId);

            // Avoid circular references or duplicate additions if data is messy
            // (Optional safety check, assuming data integrity is okay generally)

            parent.children.push(categoryMap.get(cat._id));
        } else {
            // It's a root (L1) (or parent missing from list)
            roots.push(categoryMap.get(cat._id));
        }
    });

    return roots;
};
