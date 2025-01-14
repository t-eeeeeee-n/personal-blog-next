"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useComments } from "@/components/CommentsContext";

export default function CommentForm({ postId }: { postId: number }) {
  const [content, setContent] = useState('');
  const { data: session } = useSession();
  const { toast } = useToast();
  const { fetchComments } = useComments();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session || !session.user) {
      toast({
        title: "エラー",
        description: "コメントを投稿するにはログインが必要です。",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, authorId: parseInt(session.user.id, 10), postId }), // 修正済み
      });

      if (!res.ok) throw new Error('Failed to post comment');

      setContent('');
      toast({
        title: "成功",
        description: "コメントが投稿されました。",
      });

      // コメントを再取得
      await fetchComments();
    } catch (error) {
      toast({
        title: "エラー",
        description: "コメントの投稿に失敗しました。",
        variant: "destructive",
      });
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
            placeholder="コメントを入力..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
        />
        <Button type="submit">コメントを投稿</Button>
      </form>
  );
}