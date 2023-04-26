export interface CreatePostDto {
  title: string;
  description: string;
  userId: string;
  postMedia: any[];
}

export interface SearchPostParamsDto {
  title?: string;
  description?: string;
}
