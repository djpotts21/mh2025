"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id?: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
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
      // Sort newest to oldest
      const sorted = data.sort((a: Comment, b: Comment) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setComments(sorted);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="max-h-48 overflow-y-auto pr-2 space-y-3 border-t border-gray-700 mt-4 pt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-3 px-2 py-1">
          <Image
            src={comment.profiles.avatar_url || `https://api.dicebear.com/7.x/identicon/png?seed=${comment.user_id}`}
            alt="avatar"
            width={24}
            height={24}
            className="rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold text-sm">{comment.profiles.username}</p>
            <p className="text-sm">{comment.content}</p>
            <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
