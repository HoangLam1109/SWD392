import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/service/category.service';
import type {
    CategoryListParams,
    CreateCategoryPayload,
    ICategory,
    UpdateCategoryPayload,
} from '@/types/Category.types';

export const useGetCategories = (params?: CategoryListParams) => {
    return useQuery<ICategory[], Error>({
        queryKey: ['categories', params],
        queryFn: () => categoryService.getCategories(params),
    });
};

export const useGetParentCategories = () => {
    return useQuery<ICategory[], Error>({
        queryKey: ['categories', 'parents'],
        queryFn: () => categoryService.getParentCategories(),
    });
};

export const useGetSubcategories = (parentCategoryId?: string) => {
    return useQuery<ICategory[], Error>({
        queryKey: ['categories', 'parent', parentCategoryId],
        queryFn: () => categoryService.getSubcategories(parentCategoryId!),
        enabled: Boolean(parentCategoryId),
    });
};

export const useGetCategoryById = (id?: string) => {
    return useQuery<ICategory, Error>({
        queryKey: ['categories', id],
        queryFn: () => categoryService.getCategoryById(id!),
        enabled: Boolean(id),
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation<ICategory, Error, CreateCategoryPayload>({
        mutationFn: (payload) => categoryService.createCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation<ICategory, Error, { id: string; payload: UpdateCategoryPayload }>({
        mutationFn: ({ id, payload }) => categoryService.updateCategory(id, payload),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: (id) => categoryService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
    });
};

export const useIndexCategories = () => {
    return useMutation<void, Error, void>({
        mutationFn: () => categoryService.indexCategories(),
    });
};

