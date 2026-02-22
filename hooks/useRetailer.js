import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { retailerService } from '../services/retailerService';

export const RETAILER_KEYS = {
    all: ['retailer'],
    brands: () => [...RETAILER_KEYS.all, 'brands'],
    brandInventory: (brandId, params) => [...RETAILER_KEYS.all, 'brands', brandId, 'inventory', params],
    products: (params) => [...RETAILER_KEYS.all, 'products', params],
};

export const useGetRetailerBrands = () => {
    return useQuery({
        queryKey: RETAILER_KEYS.brands(),
        queryFn: retailerService.getRetailerBrands,
    });
};

export const useUpdateRetailerBrands = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: retailerService.updateRetailerBrands,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RETAILER_KEYS.brands() });
        },
    });
};

export const useGetRetailerProducts = (params = {}) => {
    return useQuery({
        queryKey: RETAILER_KEYS.products(params),
        queryFn: () => retailerService.getRetailerProducts(params),
    });
};

export const useGetBrandInventory = (brandId, params = {}) => {
    return useQuery({
        queryKey: RETAILER_KEYS.brandInventory(brandId, params),
        queryFn: () => retailerService.getBrandInventory(brandId, params),
        enabled: !!brandId,
    });
};

export const useUpsertProductOverride = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => {
            if (data.id) return retailerService.updateProductOverride(data.id, data);
            return retailerService.upsertProductOverride(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RETAILER_KEYS.products() });
        },
    });
};
