"use client";
import { useState } from "react";

export default function CommentForm({ postId, onComment }: { postId: string; onComment: () => void }) {
  const [content, setContent] = useState("");

  const submitComment = async () => {
    const res = await fetch("/api/feed/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ post_id: postId, content }),
    });

    if (res.ok) {
      setContent("");
      onComment(); // Notify parent to refresh comments
    } else {
      alert("Failed to comment");
    }
  };

  return (
    <div className="mt-2 flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 p-2 border rounded"
      />
      <button
        onClick={submitComment}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={!content.trim()}
      >
        Post
      </button>
    </div>
  );
}
