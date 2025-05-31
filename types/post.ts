
export type Post = {
  id: string;
  user_id?: number;
  content: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
};