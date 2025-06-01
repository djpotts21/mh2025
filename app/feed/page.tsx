"use client";

import { useEffect, useState } from "react";
import { useAuth } from "context/AuthContext";
import PostCard from "components/PostCard";
import { Post } from "@/types/post";

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    const res = await fetch("/api/feed/posts");
    if (!res.ok) {
      console.error("Failed to fetch posts");
      return;
    }
    const data = await res.json();
    setPosts(data);
  };

  const handlePost = async () => {
  if (!content.trim()) return;

  setLoading(true);
  const res = await fetch("/api/feed/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    console.error("Failed to parse JSON:", err);
  }

  if (res.ok) {
    setContent("");
    await fetchPosts(); // reload posts
  } else {
    console.error("Post failed:", data?.error || "Unknown error");
  }

  setLoading(false);
};


  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📝 Public Feed</h1>

      {user && (
        <div className="mb-6">
          <textarea
            placeholder="What's on your mind?"
            className="w-full p-2 border rounded mb-2"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={handlePost}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
