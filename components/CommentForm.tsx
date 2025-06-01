"use client";
import { useState } from "react";

export default function CommentForm({
  postId,
  onComment,
}: {
  postId: string;
  onComment: () => void;
}) {
  const [content, setContent] = useState("");

  const submitComment = async () => {
    if (!content.trim()) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/feed/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({content, post_id: postId}),
    });

    if (res.ok) {
      setContent("");
      onComment();
    } else {
      console.error("Failed to post comment");
    }
  };

  return (
    <div className="mt-2">
      <textarea
        className="w-full p-2 border rounded text-sm"
        rows={2}
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        className="mt-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        onClick={submitComment}
      >
        Post
      </button>
    </div>
  );
}
