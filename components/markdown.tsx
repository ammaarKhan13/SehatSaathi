// components/markdown.tsx
import React from "react";
import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  text: string;
}

const Markdown = ({ text }: MarkdownProps) => {
  if (!text) return null;
  
  try {
    return (
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    );
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return <div className="text-red-500">Error rendering content</div>;
  }
};

export default Markdown;