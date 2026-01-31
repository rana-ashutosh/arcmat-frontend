import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import authService from '../services/authService';

const useAuthStoreBase = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Start loading to block UI until check is done
      currentVendorId: null,

      // --- ACTIONS ---
      login: (userData, token) => {
        // Normalize: handle API wrappers like { data: user } or { user: user }
        const finalUser = userData?.data || userData?.user || userData;

        // 1. Set Cookie
        if (token) {
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`; // 1 day
        }

        const vendorId = finalUser?.role === 'vendor'
          ? (finalUser.vendorId || finalUser.id)
          : null;

        set({
          user: finalUser,
          token: token,
          isAuthenticated: true,
          currentVendorId: vendorId,
          isLoading: false
        });
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          // 1. Check for token in cookies
          const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
          const token = match ? match[2] : null;

          if (!token) {
            // No token, ensure we are logged out
            set({ user: null, token: null, isAuthenticated: false, isLoading: false });
            return;
          }

          // 2. Fetch User Info
          const rawData = await authService.getUserInfo();

          // 3. Update Store
          // Handle potential API response wrapper (e.g., { data: {...} } or { user: {...} })
          const userData = rawData?.data || rawData?.user || rawData;


          const vendorId = userData?.role === 'vendor' ? (userData.vendorId || userData.id) : null;

          set({
            user: userData,
            token,
            isAuthenticated: true,
            currentVendorId: vendorId,
            isLoading: false
          });

        } catch (error) {
          // Token invalid or expired
          get().logout();
          set({ isLoading: false });
        }
      },

      logout: () => {
        // Clear cookie
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          currentVendorId: null,
          isLoading: false
        });
        localStorage.removeItem('auth-storage');
      },

      fetchUser: async () => {
        // ... (existing fetchUser can delegate to initializeAuth or stay similar)
        // Let's keep it simple and just reuse logic or keep existing but update it.
        // Actually, initializeAuth covers the "refresh" case. fetchUser is explicit.
        // Let's just alias or keep it separate.
        await get().initializeAuth();
      },

      // Helper to manually update role/vendorId if needed
      setRole: (role, vendorId = null) =>
        set((state) => ({
          user: { ...state.user, role },
          currentVendorId: vendorId
        })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Optional: trigger initializeAuth here if desired, but better to do it in a top-level component
      },
    }
  )
);

// --- EXPORTS ---
export const useAuthStore = useAuthStoreBase;
export default useAuthStoreBase;