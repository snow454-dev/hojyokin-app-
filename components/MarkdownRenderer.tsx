
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  content: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  // #1 & #2: AIがHTMLタグや不要な記号を出力した場合のクレンジング
  const cleanContent = content
    .replace(/<br\s*\/?>/gi, '\n') // <br> を改行に変換
    .replace(/<\/?[^>]+(>|$)/g, "") // その他のHTMLタグを削除
    .trim();

  return (
    <div className="markdown-body text-slate-800 leading-relaxed prose prose-slate max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
};
