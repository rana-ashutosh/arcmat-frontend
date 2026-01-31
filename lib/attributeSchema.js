
// Mock schema definition using Category Paths
// In a real app, this would likely come from a database or API

export const CATEGORY_SCHEMAS = {
    // Tiles related
    "Construction > Tiles > Wall Tiles": [
        { name: "material", label: "Material", type: "select", options: ["Ceramic", "Porcelain", "Vitrified", "Marble"], required: true },
        { name: "finish", label: "Finish", type: "select", options: ["Glossy", "Matte", "Satin", "Rustic", "Polished"], required: true },
        { name: "size", label: "Size", type: "text", required: true, suggestions: ["600x600mm", "600x1200mm", "300x300mm"] },
        { name: "thickness", label: "Thickness", type: "text", required: false, suggestions: ["8mm", "10mm", "12mm"] },
        { name: "application", label: "Application", type: "multi-select", options: ["Wall", "Floor", "Bathroom", "Kitchen"], required: true }
    ],

    // Paint related
    "Finishes > Paints > Emulsion": [
        { name: "finish", label: "Finish", type: "select", options: ["Matte", "Eggshell", "Satin", "Gloss", "High Gloss"], required: true },
        { name: "volume", label: "Volume", type: "select", options: ["1L", "4L", "10L", "20L"], required: true },
        { name: "coverage", label: "Coverage", type: "text", required: false, suggestions: ["100 sq ft/L", "120 sq ft/L"] },
        { name: "surfaces", label: "Suitable Surfaces", type: "multi-select", options: ["Interior Wall", "Exterior Wall", "Wood", "Metal"], required: true },
        { name: "voc_level", label: "VOC Level", type: "select", options: ["Low", "Medium", "High", "Zero"], required: false }
    ],

    // Flooring (Wood)
    "Flooring > Wood > Engineered Wood": [
        { name: "material", label: "Material", type: "select", options: ["Engineered Wood", "Solid Wood", "Laminate", "Bamboo"], required: true },
        { name: "finish", label: "Finish", type: "select", options: ["Oiled", "Lacquered", "Unfinished"], required: true },
        { name: "thickness", label: "Thickness", type: "text", required: true, suggestions: ["14mm", "15mm", "18mm"] },
        { name: "installation", label: "Installation Type", type: "select", options: ["Click-Lock", "Glue-Down", "Nail-Down"], required: false }
    ],

    // Furniture (Tables)
    "Furniture > Tables and chairs > Dining tables": [
        { name: "material", label: "Material", type: "select", options: ["Solid Wood", "MDF", "Glass", "Metal", "Marble"], required: true },
        { name: "shape", label: "Shape", type: "select", options: ["Round", "Rectangular", "Square", "Oval"], required: true },
        { name: "seating_capacity", label: "Seating Capacity", type: "select", options: ["2 Seater", "4 Seater", "6 Seater", "8 Seater"], required: true },
        { name: "style", label: "Style", type: "select", options: ["Modern", "Contemporary", "Traditional", "Industrial"], required: false }
    ],
    // Furniture (Sofas)
    "Furniture > Sofas and armchairs > Sofas": [
        { name: "upholstery", label: "Upholstery Material", type: "select", options: ["Fabric", "Leather", "Velvet", "Faux Leather"], required: true },
        { name: "color", label: "Color", type: "text", required: true, suggestions: ["Grey", "Beige", "Blue", "Green"] },
        { name: "seating_capacity", label: "Seating Capacity", type: "select", options: ["1 Seater", "2 Seater", "3 Seater", "L-Shape"], required: true },
        { name: "frame_material", label: "Frame Material", type: "text", required: false, suggestions: ["Pine", "Oak", "Metal"] }
    ],

    // Default fallback
    "default": [
        { name: "material", label: "Material", type: "text", required: true },
        { name: "color", label: "Color", type: "text", required: false },
        { name: "dimensions", label: "Dimensions", type: "text", required: false }
    ]
};

/**
 * matches a category path to a schema key
 * @param {string} categoryPath 
 * @returns {Array} schema definition
 */
export const getAttributeSchema = (categoryPath) => {
    if (!categoryPath) return CATEGORY_SCHEMAS["default"];

    // Exact match
    if (CATEGORY_SCHEMAS[categoryPath]) {
        return CATEGORY_SCHEMAS[categoryPath];
    }

    // Partial match (if we want to support broader categories later)
    // For now returning default if exact path not found to encourage exact paths
    return CATEGORY_SCHEMAS["default"];
};

/**
 * Checks a product for missing required attributes
 * @param {Object} product 
 * @returns {Array} list of missing field names
 */
export const getMissingAttributes = (product) => {
    const categoryPath = product.categoryPath || "";
    const schema = getAttributeSchema(categoryPath);
    const attributes = product.attributes || {};

    return schema
        .filter(field => field.required && (!attributes[field.name] || attributes[field.name] === ""))
        .map(field => field.name);
};

/**
 * Calculates whether the product is complete or incomplete
 * @param {Object} product 
 * @returns {string} "complete" | "incomplete"
 */
export const calculateAttributeStatus = (product) => {
    const missing = getMissingAttributes(product);
    return missing.length === 0 ? "complete" : "incomplete";
};