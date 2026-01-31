import { create } from 'zustand';
import { VENDORS } from '@/lib/mockData/vendors';

export const useVendorStore = create((set, get) => ({
  vendors: VENDORS,

  getVendorById: (id) => {
    return get().vendors.find((v) => v.id === id);
  },

  getVendorBySlug: (slug) => {
    return get().vendors.find((v) => v.slug === slug);
  },
}));