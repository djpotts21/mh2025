// types/post.ts
export type Post = {
  id: string;
  user_id?: number; // optional if not always needed
  content: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
};
