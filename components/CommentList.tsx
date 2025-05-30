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
  depth = 0,
  focusThread,
  setFocusThread,
}: {
  postId: string;
  parentId?: string | null;
  depth?: number;
  focusThread: string | null;
  setFocusThread: (id: string | null) => void;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [replies, setReplies] = useState<Record<string, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>({});
  const [replyCounts, setReplyCounts] = useState<Record<string, number>>({});
  const [focusedComment, setFocusedComment] = useState<Comment | null>(null);

  const MAX_DEPTH = 2;

  useEffect(() => {
    const loadComments = async () => {
      const effectiveParentId = depth === 0 && focusThread ? focusThread : parentId;

      const path = effectiveParentId
        ? `/api/feed/comments/${effectiveParentId}/replies`
        : `/api/feed/comments?post_id=${postId}`;

      const res = await fetch(path);
      if (!res.ok) {
        console.error("Failed to fetch comments");
        setLoading(false);
        return;
      }

      const data = await res.json();
      const filtered = effectiveParentId ? data : data.filter((c: Comment) => !c.parent_id);
      setComments(filtered);

      filtered.forEach((c: Comment) => fetchReplyCount(c.id));
      setLoading(false);
    };

    loadComments();

    // Fetch focused comment root if zoomed
    if (depth === 0 && focusThread) {
      const loadFocused = async () => {
        const res = await fetch(`/api/feed/comments/${focusThread}`);
        if (res.ok) {
          const data = await res.json();
          setFocusedComment(data);
        }
      };
      loadFocused();
    }
  }, [postId, parentId, focusThread, depth]);

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

  const handleLoadReplies = async (commentId: string) => {
    const alreadyExpanded = expandedReplies[commentId];
    setExpandedReplies((prev) => ({ ...prev, [commentId]: !alreadyExpanded }));

    if (!alreadyExpanded && depth >= MAX_DEPTH) {
      setFocusThread(commentId);
    }

    if (alreadyExpanded && focusThread === commentId) {
      setFocusThread(null);
    }

    if (!alreadyExpanded && !replies[commentId]) {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
      const res = await fetch(`/api/feed/comments/${commentId}/replies`);
      const data = await res.json();
      setReplies((prev) => ({ ...prev, [commentId]: data }));
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading comments...</p>;
  if (comments.length === 0 && !focusedComment) return null;

  const visibleComments =
    focusThread && depth === 0
      ? comments.filter((c) => c.id === focusThread)
      : comments;

  return (
    <div className="mt-2 space-y-2">
      {focusThread && depth === 0 && (
        <div className="mb-2">
          <button
            onClick={() => setFocusThread(null)}
            className="text-sm text-blue-600 underline"
          >
            ← Back to full thread
          </button>
        </div>
      )}

      {focusedComment && depth === 0 && (
        <div className="ml-2 border-l pl-4">
          <div className="flex items-start gap-3">
            <img
              src={focusedComment.user.avatar_url || "/avatar.png"}
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{focusedComment.user.username}</p>
              <p className="text-sm">{focusedComment.content}</p>
              <p className="text-xs text-gray-400">
                {new Date(focusedComment.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {visibleComments.map((comment) => (
        <div
          key={comment.id}
          className={`${depth < MAX_DEPTH ? "ml-2 border-l pl-4" : "mt-2"}`}
        >
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
                  onClick={() => handleLoadReplies(comment.id)}
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
                  onComment={() => {
                    handleLoadReplies(comment.id);
                    setReplyingTo(null);
                  }}
                />
              )}

              {loadingReplies[comment.id] && (
                <p className="text-xs text-gray-400 mt-1">Loading replies...</p>
              )}

              {expandedReplies[comment.id] && replies[comment.id] && (
                <div className="mt-2 space-y-2">
                  {depth >= MAX_DEPTH && (
                    <p className="text-xs text-gray-400 italic">
                      Further replies shown flat
                    </p>
                  )}
                  <CommentList
                    postId={postId}
                    parentId={comment.id}
                    depth={depth >= MAX_DEPTH ? 1 : depth + 1}
                    focusThread={focusThread}
                    setFocusThread={setFocusThread}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
