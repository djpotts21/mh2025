"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { Post } from "@/types/post";

export default function PostCard({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [focusThread, setFocusThread] = useState<string | null>(null);
  const [commentCount, setCommentCount] = useState(0);

  const fetchCommentCount = useCallback(async () => {
    const res = await fetch(`/api/feed/comments/count?post_id=${post.user_id}`);
    if (res.ok) {
      const data = await res.json();
      setCommentCount(data.count);
    }
  }, [post.id]);

  useEffect(() => {
    fetchCommentCount();
  }, [fetchCommentCount]);

  const handlePostComment = () => {
    setShowReplyForm(false);
    setShowComments(true);
    fetchCommentCount();
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Image
          src={post.profiles.avatar_url || `https://api.dicebear.com/7.x/identicon/png?seed=${post.user_id}`}
          alt="avatar"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold">{post.profiles.username}</p>
          <p>{post.content}</p>
          <p className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleString()}
          </p>
          <div className="flex gap-4 mt-2 text-sm">
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className="text-blue-600 underline"
            >
              {showComments ? "Hide Comments" : "View Comments"} ({commentCount})
            </button>
            <button
              onClick={() => {
                setShowReplyForm((prev) => !prev);
                setShowComments(false);
              }}
              className="text-blue-600 underline"
            >
              {showReplyForm ? "Cancel Reply" : "Reply"}
            </button>
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="mt-4">
          <CommentForm postId={post.id} onComment={handlePostComment} />
        </div>
      )}

      {showComments && (
        <div className="mt-4">
          <CommentList
            postId={post.id}
            focusThread={focusThread}
            setFocusThread={setFocusThread}
          />
        </div>
      )}
    </div>
  );
}
