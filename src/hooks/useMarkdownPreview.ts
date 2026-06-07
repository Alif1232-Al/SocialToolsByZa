"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { marked } from "marked";

export function useMarkdownPreview(initialValue: string) {
  const [markdown, setMarkdown] = useState(initialValue);
  const [html, setHtml] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const abortRef = useRef(false);

  useEffect(() => {
    abortRef.current = false;
    setIsParsing(true);

    const timer = setTimeout(async () => {
      try {
        const result = await marked.parse(markdown);
        if (!abortRef.current) {
          setHtml(result as string);
        }
      } catch {
        if (!abortRef.current) {
          setHtml('<p class="text-red-500 font-bold">Parse error</p>');
        }
      } finally {
        if (!abortRef.current) {
          setIsParsing(false);
        }
      }
    }, 300);

    return () => {
      abortRef.current = true;
      clearTimeout(timer);
    };
  }, [markdown]);

  const handleChange = useCallback((value: string) => {
    setMarkdown(value);
  }, []);

  const clearAll = useCallback(() => {
    setMarkdown("");
  }, []);

  const copyHtml = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(html);
    } catch {
      // silently fail
    }
  }, [html]);

  return {
    markdown,
    html,
    isParsing,
    handleChange,
    clearAll,
    copyHtml,
    charCount: markdown.length,
    wordCount: markdown.trim() ? markdown.trim().split(/\s+/).length : 0,
  };
}
