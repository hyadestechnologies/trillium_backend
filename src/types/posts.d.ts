import { PostVisibility } from '@prisma/client';

export interface CreatePostDto {
  title: string;
  description: string;
  visibility?: PostVisibility;
}

export interface SearchPostParamsDto {
  searchQuery?: string;
  pageSize?: number;
  page?: number;
}
