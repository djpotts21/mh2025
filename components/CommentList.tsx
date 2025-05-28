"use client";
import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  parent_id?: string | null;
  user: {
    username: string;
    avatar_url?: string;
  };
};

export default function CommentList({
  postId,
  parentId = null,
}: {
  postId: string;
  parentId?: string | null;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [replies, setReplies] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [replyCounts, setReplyCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const loadComments = async () => {
      const path = parentId
        ? `/api/feed/comments/${parentId}/replies`
        : `/api/feed/comments?post_id=${postId}`;

      const res = await fetch(path);
      if (!res.ok) {
        console.error("Failed to fetch comments");
        setLoading(false);
        return;
      }

      const data = await res.json();

      const filtered = parentId ? data : data.filter((c: Comment) => !c.parent_id);
      setComments(filtered);

      // Fetch reply counts for each comment
      filtered.forEach((c) => fetchReplyCount(c.id));

      setLoading(false);
    };

    loadComments();
  }, [postId, parentId]);

  const fetchReplyCount = async (commentId: string) => {
    const res = await fetch(`/api/feed/comments/${commentId}/replies/count`);
    if (res.ok) {
      const data = await res.json();
      setReplyCounts((prev) => ({ ...prev, [commentId]: data.count }));
    }
  };

  const toggleReplyForm = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const loadReplies = async (commentId: string) => {
    if (expandedReplies[commentId]) {
      setExpandedReplies((prev) => ({ ...prev, [commentId]: false }));
      return;
    }

    if (replies[commentId]) {
      setExpandedReplies((prev) => ({ ...prev, [commentId]: true }));
      return;
    }

    setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
    const res = await fetch(`/api/feed/comments/${commentId}/replies`);
    const data = await res.json();
    setReplies((prev) => ({ ...prev, [commentId]: data }));
    setExpandedReplies((prev) => ({ ...prev, [commentId]: true }));
    setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
  };

  if (loading) return <p className="text-sm text-gray-500">Loading comments...</p>;
  if (comments.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      {comments.map((comment) => (
        <div key={comment.id} className="ml-2 border-l pl-4">
          <div className="flex items-start gap-3">
            <img
              src={comment.user.avatar_url || "/avatar.png"}
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{comment.user.username}</p>
              <p className="text-sm">{comment.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(comment.created_at).toLocaleString()}
              </p>
              <div className="flex gap-4 mt-1">
                <button
                  onClick={() => toggleReplyForm(comment.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Reply
                </button>
                <button
                  onClick={() => loadReplies(comment.id)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {expandedReplies[comment.id]
                    ? "Hide Replies"
                    : `View Replies (${replyCounts[comment.id] ?? 0})`}
                </button>
              </div>

              {replyingTo === comment.id && (
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                  onComment={() => loadReplies(comment.id)}
                />
              )}

              {loadingReplies[comment.id] && (
                <p className="text-xs text-gray-400 mt-1">Loading replies...</p>
              )}

              {expandedReplies[comment.id] && replies[comment.id] && (
                <div className="ml-4 mt-2 space-y-2">
                  <CommentList postId={postId} parentId={comment.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
