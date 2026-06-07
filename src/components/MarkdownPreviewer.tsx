"use client";
import { useCallback } from "react";
import { Terminal, Eye, Copy, Trash2, Printer } from "lucide-react";
import { useMarkdownPreview } from "@/hooks/useMarkdownPreview";

const defaultMarkdown = `# Hello IT Squad! 🚀

If you're reading this, you've successfully compiled your sanity.

## Why use this?
- 404 Error: Social Life Not Found
- It works on my machine™
- Markdown is basically magic, but with more backticks.

> 'To code or not to code, that is a question with a syntax error.' - Some tired Dev.

\`\`\`javascript
while(alive) {
  eat();
  sleep();
  code();
  repeat();
}
\`\`\``;

export default function MarkdownPreviewer() {
  const {
    markdown,
    html,
    isParsing,
    handleChange,
    clearAll,
    copyHtml,
    charCount,
    wordCount,
  } = useMarkdownPreview(defaultMarkdown);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleChange(e.target.value);
    },
    [handleChange]
  );

  const handlePrint = useCallback(() => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<!DOCTYPE html><html><head><title>Markdown Preview</title>
      <style>
        body{font-family:Inter,sans-serif;padding:40px;max-width:800px;margin:0 auto;color:#000}
        pre{background:#f4f4f4;padding:16px;border:2px solid #000;overflow-x:auto}
        code{background:#f4f4f4;padding:2px 4px}
        blockquote{border-left:4px solid #000;margin:0;padding-left:16px;font-style:italic}
        img{max-width:100%}
        h1,h2,h3,h4{font-family:Impact,sans-serif;text-transform:uppercase}
        table{border-collapse:collapse;width:100%}
        td,th{border:2px solid #000;padding:8px}
      </style></head><body>${html}</body></html>`
    );
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }, [html]);

  return (
    <div className="relative md:col-span-2 bg-gray-50 border-4 border-black p-6 comic-shadow flex flex-col">
      <div className="absolute -top-4 -right-4 bg-pink-500 text-white px-4 py-1.5 border-4 border-black comic-shadow rotate-12 font-display font-black uppercase text-sm">
        ZAP!
      </div>
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2">
        <Terminal className="w-6 h-6" />
        Markdown Previewer
      </h3>
      <p className="font-body text-body-md text-gray-600 mb-4">
        Tulis catatan kuliah pakai MD, liat hasilnya real-time. Auto rapih, auto A!
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="bg-cyan-500 text-white border-4 border-black px-3 py-1.5 font-body font-bold uppercase text-xs flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Terminal className="w-4 h-4" /> INPUT_FIELD.MD
            </span>
          </div>
          <textarea
            value={markdown}
            onChange={onInputChange}
            className="w-full min-h-[300px] p-4 font-mono text-sm bg-white border-4 border-black outline-none resize-none"
          />
        </div>
        <div className="flex flex-col">
          <div className="bg-yellow-400 text-black border-4 border-black px-3 py-1.5 font-body font-bold uppercase text-xs flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> LIVE_RENDER.HTML
            </span>
            {isParsing && <span className="text-[10px] animate-pulse">Parsing...</span>}
          </div>
          <div
            className="markdown-preview w-full min-h-[300px] p-4 bg-white border-4 border-black overflow-x-auto overflow-y-auto break-words"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
      <div className="mt-4 border-4 border-black bg-gray-100 p-4 flex flex-wrap items-center gap-4">
        <div className="flex gap-3">
          <span className="bg-black text-white px-3 py-1 font-body font-bold text-xs">
            CHARS: {charCount}
          </span>
          <span className="bg-white border-2 border-black px-3 py-1 font-body font-bold text-xs text-cyan-600">
            WORDS: {wordCount}
          </span>
        </div>
        <div className="flex-1" />
        <button
          onClick={clearAll}
          className="flex items-center gap-1 font-body font-bold uppercase bg-red-100 text-red-700 border-4 border-black px-4 py-2 text-xs hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <Trash2 className="w-4 h-4" /> CLEAR ALL
        </button>
        <button
          onClick={copyHtml}
          className="flex items-center gap-1 font-body font-bold uppercase bg-cyan-500 text-white border-4 border-black px-4 py-2 text-xs hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <Copy className="w-4 h-4" /> COPY HTML
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1 font-body font-bold uppercase bg-black text-white border-4 border-black px-4 py-2 text-xs hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <Printer className="w-4 h-4" /> PRINT PDF
        </button>
      </div>
    </div>
  );
}
