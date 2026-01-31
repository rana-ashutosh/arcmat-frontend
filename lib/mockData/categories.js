export const CATEGORIES = [
  { id: 1, name: 'Tiles', slug: 'tiles' },
  { id: 2, name: 'Paints', slug: 'paints' },
  { id: 3, name: 'Flooring', slug: 'flooring' },
  { id: 4, name: 'Lighting', slug: 'lighting' },
  { id: 5, name: 'Furniture', slug: 'furniture' },
  { id: 6, name: 'Sanitaryware', slug: 'sanitaryware' },
  { id: 7, name: 'Doors & Windows', slug: 'doors-windows' },
  { id: 8, name: 'Wallpaper', slug: 'wallpaper' },
];

export const PRICE_RANGES = [
  { id: 1, label: 'Under ₹1,000', min: 0, max: 1000 },
  { id: 2, label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
  { id: 3, label: '₹5,000 - ₹10,000', min: 5000, max: 10000 },
  { id: 4, label: '₹10,000 - ₹25,000', min: 10000, max: 25000 },
  { id: 5, label: 'Above ₹25,000', min: 25000, max: Infinity },
];

export const STOCK_FILTERS = [
  { id: 'in-stock', label: 'In Stock', value: true },
  { id: 'out-of-stock', label: 'Out of Stock', value: false },
];