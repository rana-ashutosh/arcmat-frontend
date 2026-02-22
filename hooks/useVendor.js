import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import brandService from '@/services/vendorService';

export const useGetVendors = ({ enabled = true, ...params } = {}) => {
    return useQuery({
        queryKey: ['brands', params],
        queryFn: async () => {
            const response = await brandService.getAllBrands(params);
            return response.data || response;
        },
        enabled
    });
};

export const useGetVendor = (id) => {
    return useQuery({
        queryKey: ['brand', id],
        queryFn: () => brandService.getBrandById(id),
        enabled: !!id,
    });
};

export const useCreateVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: brandService.createBrand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
    });
};

export const useUpdateVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => brandService.updateBrand(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
    });
};

export const useDeleteVendor = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: brandService.deleteBrand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['brands'] });
        },
    });
};
