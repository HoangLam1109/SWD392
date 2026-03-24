export interface ICategory {
    categoryId: string;
    categoryName: string;
    description: string;
    parentCategoryId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryListParams {
    page?: number;
    limit?: number;
}

export interface CreateCategoryPayload {
    name: string;
    description?: string;
    parentCategoryId?: string | null;
}

export interface UpdateCategoryPayload {
    name?: string;
    description?: string;
    parentCategoryId?: string | null;
}