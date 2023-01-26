export interface CreatePostDto {
  title: string;
  description: string;
  userId: string;
  postMedia: any[];
  postComments: any[];
}
