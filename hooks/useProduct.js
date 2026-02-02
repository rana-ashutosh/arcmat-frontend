import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { toast } from '@/components/ui/Toast';

// Keys for cache management
export const PRODUCT_KEYS = {
    all: ['products'],
    lists: () => [...PRODUCT_KEYS.all, 'list'],
    list: (filters) => [...PRODUCT_KEYS.lists(), { ...filters }],
    details: () => [...PRODUCT_KEYS.all, 'detail'],
    detail: (id) => [...PRODUCT_KEYS.details(), id],
};

// Hook to fetch products
export const useGetProducts = ({ userId, page, limit, enabled = true, ...otherFilters } = {}) => {
    return useQuery({
        queryKey: PRODUCT_KEYS.list({ userId, page, limit, ...otherFilters }),
        queryFn: () => productService.getAllProducts({
            userid: userId,
            user_id: userId,
            page,
            limit,
            offset: (page - 1) * limit,
            q: otherFilters.search,
            search: otherFilters.search,
            keyword: otherFilters.search,
            query: otherFilters.search,
            search_term: otherFilters.search,
            ...otherFilters
        }),
        enabled: enabled,
    });
};

// Hook to fetch single product
export const useGetProduct = (id) => {
    return useQuery({
        queryKey: PRODUCT_KEYS.detail(id),
        queryFn: () => productService.getProductById(id),
        enabled: !!id,
        onSuccess(data){
            console.log('Product fetched successfully!',data);
            return data
        }
    });
};

// Hook to create product
export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productService.createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
        },
    });
};

// Hook to update product
export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => productService.updateProduct(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(variables.id) });
        },
    });
};

// Hook to delete product
export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: productService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
        },
    });
};

// Hook to bulk import products
export const useBulkImportProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file) => productService.bulkImport(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
        },
    });
};
