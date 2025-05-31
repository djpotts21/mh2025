"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id?: string;
  user: {
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
      setComments(data);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const renderComment = (comment: Comment, depth = 0) => {
    const childComments = comments.filter((c) => c.parent_id === comment.id);

    return (
      <div key={comment.id} className={`ml-${depth * 4} mb-3`}>
        <div className="flex items-start gap-2">
          <Image
            src={comment.user.avatar_url || "/avatar.png"}
            alt="avatar"
            width={24}
            height={24}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-sm">{comment.user.username}</p>
            <p className="text-sm">{comment.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(comment.created_at).toLocaleString()}
            </p>
            {!focusThread && (
              <button
                onClick={() => setFocusThread(comment.id)}
                className="text-xs text-blue-600 mt-1 underline"
              >
                Reply
              </button>
            )}
          </div>
        </div>

        {childComments.length > 0 && (
          <div className="mt-2">
            {childComments.map((child) => renderComment(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const topLevelComments = comments.filter((c) => !c.parent_id);

  return <div>{topLevelComments.map((c) => renderComment(c))}</div>;
}
