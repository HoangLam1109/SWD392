export type BlogStatus = "PENDING_APPROVAL" | "APPROVED" | "REJECTED";

export interface Blog {
    _id: string;
    title: string;
    content: string;
    thumbnailUrl?: string;
    status: BlogStatus;
    viewCount: number;
    publishedAt: string | null;
    userId: string;
    created_at: string;
    updated_at: string;
}

export interface BlogsResponse {
    data: Blog[];
    hasNextPage: boolean;
    totalCount: number;
}

