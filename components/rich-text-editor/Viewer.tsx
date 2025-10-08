"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';

interface RichTextViewerProps {
  content: string;
}

export function RichTextViewer({ content }: RichTextViewerProps) {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none dark:prose-invert focus:outline-none',
      },
    },
    immediatelyRender: false, // ✅ This fixes the SSR issue
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (editor && content && isMounted) {
      try {
        const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
        editor.commands.setContent(parsedContent);
      } catch (e) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content, isMounted]);

  if (!isMounted) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/6" />
      </div>
    );
  }

  return (
    <div suppressHydrationWarning>
      <EditorContent editor={editor} />
    </div>
  );
}
