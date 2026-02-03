import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import addressService from '../services/addressService';

export const ADDRESS_KEYS = {
    all: ['addresses'],
    lists: (userId) => [...ADDRESS_KEYS.all, 'list', userId].filter(Boolean),
    details: () => [...ADDRESS_KEYS.all, 'detail'],
    detail: (id) => [...ADDRESS_KEYS.details(), id],
};

export const useGetAddresses = (userId) => {
    return useQuery({
        queryKey: ADDRESS_KEYS.lists(userId),
        queryFn: addressService.getAddresses,
        enabled: !!userId,
    });
};

export const useGetAddress = (id) => {
    return useQuery({
        queryKey: ADDRESS_KEYS.detail(id),
        queryFn: () => addressService.getAddressById(id),
        enabled: !!id,
    });
};

export const useCreateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addressService.createAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.lists() });
        },
    });
};

export const useUpdateAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => addressService.updateAddress(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['addresses', 'list'] });
            queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.detail(variables.id) });
        },
    });
};

export const useDeleteAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addressService.deleteAddress,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADDRESS_KEYS.lists() });
        },
    });
};
