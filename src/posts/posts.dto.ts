export interface CreatePostDto {
  title: string;
  description: string;
  userId: string;
  postMedia: any[];
}

export interface UpdatePostDto {
  title: string;
  description: string;
  postMedia: any[];
}
