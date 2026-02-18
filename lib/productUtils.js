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
 * Handles brand-prefixed paths: "brand-id/filename.jpg"
 */
export const getProductImageUrl = (imgName) => {
    if (!imgName) return '/Icons/arcmatlogo.svg';
    if (imgName.startsWith('http') || imgName.startsWith('data:') || imgName.startsWith('/')) return imgName;

    // Clean path and construct URL (handles both "brand-id/filename" and legacy "filename")
    const cleanPath = imgName.replace(/^\/+/, '');
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/public/uploads/product/${cleanPath}`;
};

/**
 * Resolves the full URL for a variant image.
 * Handles brand-prefixed paths: "brand-id/filename.jpg"
 * Note: Variant images are stored in the product folder
 */
export const getVariantImageUrl = (imgName) => {
    if (!imgName) return '/Icons/arcmatlogo.svg';
    if (imgName.startsWith('http') || imgName.startsWith('data:') || imgName.startsWith('/')) return imgName;

    // Clean path and construct URL (variants use product folder)
    const cleanPath = imgName.replace(/^\/+/, '');
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/public/uploads/product/${cleanPath}`;
};

export const getCategoryImageUrl = (imgName) => {
    if (!imgName) return null;
    if (imgName.startsWith('http') || imgName.startsWith('data:') || imgName.startsWith('/')) return imgName;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/public/uploads/category/${imgName}`;
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
            return [];
        }
    }
    return attributes;
};

/**
 * Maps color names to CSS hex codes.
 */
export const getColorCode = (colorName) => {
    if (!colorName) return 'transparent';
    const name = colorName.toLowerCase().trim();
    const colorMap = {
        'red': '#ef4444',
        'blue': '#3b82f6',
        'green': '#22c55e',
        'yellow': '#eab308',
        'orange': '#f97316',
        'purple': '#a855f7',
        'pink': '#ec4899',
        'black': '#000000',
        'white': '#ffffff',
        'gray': '#6b7280',
        'grey': '#6b7280',
        'brown': '#78350f',
        'beige': '#f5f5dc',
        'gold': '#ffd700',
        'silver': '#c0c0c0',
        'maroon': '#800000',
        'navy': '#000080',
        'teal': '#008080',
    };
    return colorMap[name] || name;
};

/**
 * Calculates discount percentage.
 */
export const calculateDiscount = (mrp, price) => {
    if (!mrp || !price || Number(mrp) <= Number(price)) return 0;
    return Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100);
};

/**
 * Formats a number with Indian numbering system (with commas).
 */
export const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString('en-IN');
};

/**
 * Resolves pricing (Price and MRP) from product or variant.
 */
export const resolvePricing = (product, selectedVariant = null) => {
    const currentItem = selectedVariant || product;
    if (!currentItem) return { price: 0, mrp: 0, hasPrice: false, hasMrp: false };

    const price = currentItem.selling_price || currentItem.price || product?.minPrice || product?.selling_price;
    const mrp = currentItem.mrp_price || currentItem.mrp || product?.mrp_price || product?.mrp;

    return {
        price: Number(price) || 0,
        mrp: Number(mrp) || 0,
        hasPrice: Boolean(price && Number(price) > 0),
        hasMrp: Boolean(mrp && Number(mrp) > 0)
    };
};

/**
 * Aggregates specifications from product and variant.
 */
export const getSpecifications = (product, selectedVariant = null) => {
    if (!product) return [];

    const parseAttrs = (attrs) => {
        if (!attrs) return [];
        return typeof attrs === 'string' ? JSON.parse(attrs) : attrs;
    };

    const dynamicAttributes = parseAttrs(product.dynamicAttributes);
    const variantDynamicAttributes = selectedVariant ? parseAttrs(selectedVariant.dynamicAttributes) : [];

    const displayWeight = selectedVariant?.weight
        ? `${selectedVariant.weight} ${selectedVariant.weight_type || selectedVariant.weight_unit || 'kg'}`
        : (product.weight ? `${product.weight} ${product.weight_type || 'kg'}` : null);

    const allSpecs = [
        ...dynamicAttributes.map(a => ({ label: a.attributeName || a.key, value: a.attributeValue || a.value })),
        ...variantDynamicAttributes.map(a => ({ label: a.attributeName || a.key, value: a.attributeValue || a.value })),
        ...(selectedVariant ? [
            { label: 'Color', value: selectedVariant.color },
            { label: 'Size', value: selectedVariant.size },
            { label: 'Weight', value: displayWeight },
            { label: 'SKU', value: selectedVariant.skucode || selectedVariant._id }
        ] : [])
    ].filter(attr => attr.value !== undefined && attr.value !== null && attr.value !== '' && attr.value !== 'null' && attr.value !== 'undefined');

    // Filter duplicates by case-insensitive label
    const seen = new Set();
    return allSpecs.filter(item => {
        const labelSafe = (item.label || '').toLowerCase();
        if (seen.has(labelSafe)) return false;
        seen.add(labelSafe);
        return true;
    });
};
