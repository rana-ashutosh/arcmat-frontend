import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // Filters
  searchQuery: '',
  selectedCategories: [],
  selectedVendors: [],

  priceRange: { min: 0, max: Infinity },
  stockFilter: null,
  sortBy: 'newest',

  // Pagination
  currentPage: 1,
  itemsPerPage: 12,

  // Modals
  isBulkUploadModalOpen: false,
  isProductFormModalOpen: false,
  editingProduct: null,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setSelectedCategories: (categories) => set({ selectedCategories: categories, currentPage: 1 }),
  setSelectedVendors: (vendors) => set({ selectedVendors: vendors, currentPage: 1 }),



  setPriceRange: (range) => set({ priceRange: range, currentPage: 1 }),
  setStockFilter: (filter) => set({ stockFilter: filter, currentPage: 1 }),
  setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),

  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCategories: [],
      selectedVendors: [],

      priceRange: { min: 0, max: Infinity },
      stockFilter: null,
      sortBy: 'newest',
      currentPage: 1,
    }),

  openBulkUploadModal: () => set({ isBulkUploadModalOpen: true }),
  closeBulkUploadModal: () => set({ isBulkUploadModalOpen: false }),

  openProductFormModal: (product = null) =>
    set({ isProductFormModalOpen: true, editingProduct: product }),
  closeProductFormModal: () =>
    set({ isProductFormModalOpen: false, editingProduct: null }),
}));