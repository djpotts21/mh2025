"use client";

import { useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

type Post = {
  id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
};

export default function PostCard({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [focusThread, setFocusThread] = useState<string | null>(null);

  const fetchCommentCount = async () => {
    const res = await fetch(`/api/feed/comments/count?post_id=${post.id}`);
    if (res.ok) {
      const data = await res.json();
      setCommentCount(data.count);
    }
  };

  useEffect(() => {
    fetchCommentCount();
  }, [post.id]);

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <img
          src={post.user.avatar_url || "/avatar.png"}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{post.user.username}</p>
          <p>{post.content}</p>
          <p className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleString()}
          </p>
          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="text-sm text-blue-600 mt-2 underline"
          >
            {showComments ? "Hide" : "Show"} Comments ({commentCount})
          </button>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 w-full">
          <CommentList
            postId={post.id}
            focusThread={focusThread}
            setFocusThread={setFocusThread}
          />

          {/* Only show main comment form when not in a focused thread */}
          {!focusThread && (
            <CommentForm
              postId={post.id}
              onComment={() => {
                setShowComments(true);
                fetchCommentCount();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
