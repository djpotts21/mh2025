"use client";
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
};

export default function CommentList({ postId, parentId = null }: { postId: string; parentId?: string | null }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Record<string, Comment[]>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadComments = async () => {
    const path = parentId
      ? `/api/feed/comments/${parentId}/replies`
      : `/api/feed/comments?post_id=${postId}`;

    const res = await fetch(path);
    if (res.ok) {
      const data = await res.json();
      if (parentId) {
        setReplies((prev) => ({ ...prev, [parentId]: data }));
      } else {
        setComments(data);
      }
    } else {
      console.error("Failed to load comments");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [postId, parentId]);

  const handleReply = (commentId: string) => {
    setReplyingTo(commentId === replyingTo ? null : commentId);
  };

  const allComments = parentId ? replies[parentId] || [] : comments;

  if (loading) return <p className="text-sm text-gray-500">Loading comments...</p>;
  if (allComments.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {allComments.map((comment) => (
        <div key={comment.id} className="ml-2 border-l pl-4">
          <div className="flex items-start gap-3">
            <img
              src={comment.user.avatar_url || "/avatar.png"}
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{comment.user.username}</p>
              <p className="text-sm text-gray-700">{comment.content}</p>
              <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</p>
              <button
                onClick={() => handleReply(comment.id)}
                className="text-xs text-blue-600 hover:underline"
              >
                Reply
              </button>
              {replyingTo === comment.id && (
                <CommentForm postId={postId} parentId={comment.id} onComment={loadComments} />
              )}
              <CommentList postId={postId} parentId={comment.id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
