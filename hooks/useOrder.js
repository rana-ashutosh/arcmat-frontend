import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export const ORDER_KEYS = {
    all: ['orders'],
    lists: () => [...ORDER_KEYS.all, 'list'],
    list: (params) => [...ORDER_KEYS.lists(), { ...params }],
    details: () => [...ORDER_KEYS.all, 'detail'],
    detail: (id) => [...ORDER_KEYS.details(), id],
};

export const useGetOrders = (params = {}) => {
    return useQuery({
        queryKey: ORDER_KEYS.list(params),
        queryFn: () => orderService.getAllOrders(params),
    });
};

export const useGetOrder = (id) => {
    return useQuery({
        queryKey: ORDER_KEYS.detail(id),
        queryFn: () => orderService.getOrderById(id),
        enabled: !!id,
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
        },
    });
};
