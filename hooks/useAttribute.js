import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attributeService } from '../services/attributeService';

export const ATTRIBUTE_KEYS = {
    all: ['attributes'],
    list: () => [...ATTRIBUTE_KEYS.all, 'list'],
};

export const useGetAttributes = () => {
    return useQuery({
        queryKey: ATTRIBUTE_KEYS.list(),
        queryFn: attributeService.getAllAttributes,
    });
};

export const useCreateAttribute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: attributeService.createAttribute,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ATTRIBUTE_KEYS.list() });
        },
    });
};
