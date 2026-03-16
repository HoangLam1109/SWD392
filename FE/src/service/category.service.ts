import apiClient from '@/lib/apiClient';
import type {
    CategoryListParams,
    CreateCategoryPayload,
    ICategory,
    UpdateCategoryPayload,
} from '@/types/Category.types';

type RawCategory = Partial<ICategory> & { _id?: string; id?: string };

function normalizeCategory(item: RawCategory): ICategory {
    return {
        ...item,
        categoryId: item.categoryId ?? item._id ?? item.id ?? '',
    } as ICategory;
}

function extractAndNormalize(
    data: { data?: RawCategory[] } | RawCategory[],
): ICategory[] {
    const items = Array.isArray(data) ? data : data.data ?? [];
    return items.map(normalizeCategory);
}

export const categoryService = {
    async getCategories(params?: CategoryListParams): Promise<ICategory[]> {
        const response = await apiClient.get('/categories', { params });
        return extractAndNormalize(response.data);
    },

    async getParentCategories(): Promise<ICategory[]> {
        const response = await apiClient.get('/categories/parents/all');
        return extractAndNormalize(response.data);
    },

    async getSubcategories(parentCategoryId: string): Promise<ICategory[]> {
        const response = await apiClient.get(
            `/categories/parent/${encodeURIComponent(parentCategoryId)}`
        );
        return extractAndNormalize(response.data);
    },

    async getCategoryById(id: string): Promise<ICategory> {
        const response = await apiClient.get(`/categories/${encodeURIComponent(id)}`);
        return normalizeCategory(response.data as RawCategory);
    },

    async createCategory(payload: CreateCategoryPayload): Promise<ICategory> {
        const response = await apiClient.post('/categories', {
            categoryName: payload.name,
            description: payload.description,
            parentCategoryId: payload.parentCategoryId,
        });
        return normalizeCategory(response.data as RawCategory);
    },

    async updateCategory(id: string, payload: UpdateCategoryPayload): Promise<ICategory> {
        const response = await apiClient.patch(
            `/categories/${encodeURIComponent(id)}`,
            payload
        );
        return normalizeCategory(response.data as RawCategory);
    },

    async deleteCategory(id: string): Promise<void> {
        await apiClient.delete(`/categories/${encodeURIComponent(id)}`);
    },

    async indexCategories(): Promise<void> {
        await apiClient.get('/categories/get/index');
    },
};

