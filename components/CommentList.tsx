"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import LikeButton from "./LikeButton";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id?: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

interface CommentListProps {
  postId: string;
  focusThread: string | null;
  setFocusThread: (id: string | null) => void;
}

export default function CommentList({ postId, focusThread, setFocusThread }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    const res = await fetch(`/api/feed/comments?post_id=${postId}`);
    if (res.ok) {
      const data = await res.json();
      const sorted = data.sort(
        (a: Comment, b: Comment) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setComments(sorted);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="max-h-60 overflow-y-auto pr-1 space-y-4 border-t border-gray-700 mt-4 pt-4 scrollbar-thick scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2">
          <Image
            src={
              comment.user.avatar_url ||
              `https://api.dicebear.com/7.x/identicon/png?seed=${comment.user.id}`
            }
            alt="avatar"
            width={24}
            height={24}
            className="rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex justify-between">
              <p className="font-semibold text-sm">{comment.user.username}</p>
              <LikeButton targetId={comment.id} type="comment" />
            </div>
            <p className="text-sm">{comment.content}</p>
            <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
