export interface CreatePostDto {
  title: string;
  description: string;
  postMedia: any[];
}

export interface SearchPostParamsDto {
  searchQuery?: string;
  pageSize?: number;
  page?: number;
}
