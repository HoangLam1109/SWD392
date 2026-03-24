export class PaginationResponseDto<T> {
  data: T[];
  hasNextPage: boolean;
  totalCount?: number;
  nextCursor?: string;
}
