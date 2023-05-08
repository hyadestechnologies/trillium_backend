export interface CreatePostDto {
  title: string;
  description: string;
  visibility?: string;
}

export interface SearchPostParamsDto {
  searchQuery?: string;
  pageSize?: number;
  page?: number;
}
