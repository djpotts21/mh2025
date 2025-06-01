"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import LikeButton from "./LikeButton";
import { Post } from "@/types/post";

export default function PostCard({ post }: { post: Post }) {
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
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
    <div className="border rounded-lg p-4 shadow-sm" style={{ backgroundColor: "var(--background)", color: "var(--foreground)", borderRadius: "var(--borderradius)" }}>
      <div className="flex items-start gap-3">
        <Image
          src={
            post.user.avatar_url ||
            `https://api.dicebear.com/7.x/identicon/png?seed=${post.user.id}`
          }
          alt="avatar"
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
        <div className="w-full">
          <p className="font-semibold">{post.user.username}</p>
          <p>{post.content}</p>
          <p className="text-xs text-gray-400">
            {new Date(post.created_at).toLocaleString()}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => setShowComments((prev) => !prev)}
                className="text-sm text-blue-600 underline"
              >
                {showComments ? "Hide" : "View"} Comments ({commentCount})
              </button>
              <button
                onClick={() => {
                  setShowCommentForm(true);
                  setShowComments(true);
                }}
                className="text-sm text-blue-600 underline"
              >
                Reply
              </button>
            </div>
            <LikeButton targetId={post.id} type="post" />
          </div>
        </div>
      </div>

      {showComments && (
        <div className="mt-4 w-full">
          <CommentList
            postId={post.id}
            focusThread={focusThread}
            setFocusThread={setFocusThread}
          />

          {showCommentForm && !focusThread && (
            <CommentForm
              postId={post.id}
              onComment={() => {
                setShowCommentForm(false);
                fetchCommentCount();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
