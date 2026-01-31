import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import vendorService from '@/services/vendorService';

export const useGetVendors = () => {
    return useQuery({
        queryKey: ['vendors'],
        queryFn: vendorService.getAllVendors,
    });
};

export const useGetVendor = (id) => {
    return useQuery({
        queryKey: ['vendor', id],
        queryFn: () => vendorService.getVendorById(id),
        enabled: !!id,
    });
};

export const useCreateVendor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: vendorService.createVendor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
            queryClient.invalidateQueries({ queryKey: ['vendor'] });
        },
    });
};

export const useUpdateVendor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => vendorService.updateVendor(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
            queryClient.invalidateQueries({ queryKey: ['vendor'] });
        },
    });
};

export const useDeleteVendor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: vendorService.deleteVendor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vendors'] });
            queryClient.invalidateQueries({ queryKey: ['vendor'] });
        },
    });
};
