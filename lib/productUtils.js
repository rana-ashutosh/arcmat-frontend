/**
 * Generates a URL-friendly slug from a string.
 */
export const generateSlug = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
};

/**
 * Formats a string as an uppercase SKU.
 */
export const formatSKU = (text) => {
    if (!text) return '';
    return text.toUpperCase().trim().replace(/\s+/g, '-');
};

/**
 * Resolves the full URL for a product image.
 */
export const getProductImageUrl = (imgName) => {
    if (!imgName) return '/Icons/arcmatlogo.svg';
    if (imgName.startsWith('http') || imgName.startsWith('data:') || imgName.startsWith('/')) return imgName;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/public/uploads/product/${imgName}`;
};

/**
 * Resolves the full URL for a variant image.
 */
export const getVariantImageUrl = (imgName) => {
    if (!imgName) return '/Icons/arcmatlogo.svg';
    if (imgName.startsWith('http') || imgName.startsWith('data:') || imgName.startsWith('/')) return imgName;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/public/uploads/variant/${imgName}`;
};

/**
 * Resolves the full URL for a banner image.
 */
export const getBannerImageUrl = (imgName) => {
    if (!imgName) return null;
    if (imgName.startsWith('http') || imgName.startsWith('data:') || imgName.startsWith('/')) return imgName;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/public/uploads/banner/${imgName}`;
};

/**
 * Formats a number as a currency string (INR).
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
    }).format(amount || 0);
};

/**
 * Parses dynamic attributes if they are in JSON string format.
 */
export const parseAttributes = (attributes) => {
    if (!attributes) return [];
    if (typeof attributes === 'string') {
        try {
            return JSON.parse(attributes);
        } catch (e) {
            console.error('Error parsing attributes:', e);
            return [];
        }
    }
    return attributes;
};
