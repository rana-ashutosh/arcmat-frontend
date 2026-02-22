import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '../services/brandService';

export const BRAND_KEYS = {
    all: ['brands'],
    list: (params) => [...BRAND_KEYS.all, 'list', params],
    detail: (id) => [...BRAND_KEYS.all, 'detail', id],
};

export const useGetBrands = (params = {}) => {
    return useQuery({
        queryKey: BRAND_KEYS.list(params),
        queryFn: () => brandService.getAllBrands(params),
    });
};

export const useGetBrandById = (id) => {
    return useQuery({
        queryKey: BRAND_KEYS.detail(id),
        queryFn: () => brandService.getBrandById(id),
        enabled: !!id,
    });
};

export const useCreateBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: brandService.createBrand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRAND_KEYS.all });
        },
    });
};

export const useUpdateBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => brandService.updateBrand(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRAND_KEYS.all });
        },
    });
};

export const useDeleteBrand = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: brandService.deleteBrand,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BRAND_KEYS.all });
        },
    });
};
