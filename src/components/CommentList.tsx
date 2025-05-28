"use client";
import { useEffect, useState } from "react";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
};

export default function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      const res = await fetch(`/api/feed/comments?post_id=${postId}`);

      if (res.ok) {
        const data = await res.json();
        setComments(data);
        setComments(data.reverse());
      } else {
        console.error("Failed to load comments");
      }

      setLoading(false);
    };

    loadComments();
  }, [postId]);

  if (loading) return <p className="text-sm text-gray-500">Loading comments...</p>;
  if (comments.length === 0) return <p className="text-sm text-gray-400">No comments yet.</p>;

  return (
    <div className="mt-2 space-y-2">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-3">
          <img
            src={comment.user.avatar_url || "/avatar.png"}
            alt="avatar"
            className="w-6 h-6 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">{comment.user.username}</p>
            <p className="text-sm text-gray-700">{comment.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
