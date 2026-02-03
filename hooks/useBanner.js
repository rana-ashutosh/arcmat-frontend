import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import bannerService from '@/services/bannerService';

// Hook to get all banners
export const useGetBanners = ({ enabled = true, ...params } = {}) => {
    return useQuery({
        queryKey: ['banners', params],
        queryFn: async () => {
            const response = await bannerService.getAllBanners(params);
            return response.data || response;
        },
        enabled
    });
};

// Hook to get a single banner
export const useGetBanner = (id) => {
    return useQuery({
        queryKey: ['banner', id],
        queryFn: () => bannerService.getBannerById(id),
        enabled: !!id,
    });
};

// Hook to create a banner
export const useCreateBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bannerService.createBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });
};

// Hook to update a banner
export const useUpdateBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => bannerService.updateBanner(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            queryClient.invalidateQueries({ queryKey: ['banner', variables.id] });
        },
    });
};

// Hook to delete a banner
export const useDeleteBanner = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bannerService.deleteBanner,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
        },
    });
};
