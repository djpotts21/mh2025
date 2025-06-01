"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const supabase = createClientComponentClient<Database>();

import { useEffect, useState } from "react";
import { HeartIcon as SolidHeart } from "@heroicons/react/24/solid";
import { HeartIcon as OutlineHeart } from "@heroicons/react/24/outline";

interface LikeButtonProps {
  targetId: string;
  type: "post" | "comment";
}

function formatCount(count: number): string {
  if (count >= 1_000_000) return (count / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
  if (count >= 1_000) return (count / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return count.toString();
}

export default function LikeButton({ targetId, type }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchLikes = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const res = await fetch("/api/feed/likes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [`${type}_id`]: targetId }),
  });

  const data = await res.json();

  if (res.ok && user) {
    setLiked(data.likes.some((l: { user_id: string }) => l.user_id === user.id));
    setLikeCount(data.likes.length);
  }
};


  const toggleLike = async () => {
    if (loading) return;
    setLoading(true);

    const res = await fetch("/api/feed/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ [`${type}_id`]: targetId }),
    });

    if (res.ok) await fetchLikes();
    setLoading(false);
  };

  useEffect(() => {
    fetchLikes();
  }, [targetId]);

  const Icon = liked ? SolidHeart : OutlineHeart;

  return (
    <button onClick={toggleLike} className="flex items-center gap-1 text-sm text-pink-600">
      <Icon className="h-5 w-5" />
      {formatCount(likeCount)}
    </button>
  );
}
