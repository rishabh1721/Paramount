"use client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from "@tiptap/starter-kit";
import { Menubar } from './Menubar';
import TextAlign from '@tiptap/extension-text-align';
import { useEffect } from 'react';

interface RichTextEditorProps {
  field: any;
  disabled?: boolean;
}

export function RichTextEditor({ field, disabled = false }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      })
    ],
    content: field.value 
      ? (typeof field.value === 'string' && field.value.startsWith('{')
          ? JSON.parse(field.value)
          : field.value)
      : undefined,
    immediatelyRender: false,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: 'min-h-[300px] p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      if (!disabled) {
        const json = editor.getJSON();
        field.onChange(JSON.stringify(json));
      }
    },
  });

  // ✅ FIX: Remove the useEffect that was causing the setState in render error
  // The onUpdate handler above already handles changes properly

  // Update editor editable state when disabled prop changes
  useEffect(() => {
    if (editor && editor.isEditable !== !disabled) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 ${disabled ? 'opacity-60 pointer-events-none' : ''}`}>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
