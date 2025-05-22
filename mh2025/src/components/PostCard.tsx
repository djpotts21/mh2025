"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import UserAvatarPopover from "./UserAvatarPopover";

type Post = {
  id: string;
  user_id: number;
  content: string;
  created_at: string;
  user?: {
    username: string;
    avatar_url?: string;
  };
};

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const { user } = useAuth();
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState(false);

  const fetchLikes = async () => {
    const res = await fetch("/api/feed/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post_id: post.id }),
    });

    if (!res.ok) {
      console.error("Failed to fetch likes");
      return;
    }

    const data = await res.json();
    setLikes(data.likes.length);

    if (user?.user_id) {
      const liked = data.likes.some(
        (l: any) => String(l.user_id) === String(user.user_id)
      );
      setHasLiked(liked);
    }
  };

  const toggleLike = async () => {
    if (!user) return;

    const res = await fetch("/api/feed/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ post_id: post.id }),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.message === "Liked") {
        setHasLiked(true);
        setLikes((prev) => prev + 1);
      } else if (result.message === "Unliked") {
        setHasLiked(false);
        setLikes((prev) => Math.max(0, prev - 1));
      }
    } else {
      console.error("Failed to toggle like");
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchLikes();
    }
  }, [user?.user_id]);

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserAvatarPopover userId={post.user_id}>
            <img
              src={post.user?.avatar_url || "/avatar.png"}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          </UserAvatarPopover>
          <span className="font-semibold">{post.user?.username || "User"}</span>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(post.created_at).toLocaleString()}
        </span>
      </div>

      <p className="mt-3 whitespace-pre-line">{post.content}</p>

      <div className="mt-4 flex gap-4 items-center">
        <button
          onClick={toggleLike}
          className={`text-sm ${
            hasLiked ? "text-red-600 font-bold" : "text-gray-600"
          }`}
        >
          ❤️ {likes}
        </button>

        <button className="text-sm text-blue-600 hover:underline">
          💬 Comment
        </button>
      </div>
    </div>
  );
}
