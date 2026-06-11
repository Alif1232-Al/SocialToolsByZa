"use client";

import { useCallback } from "react";
import { Braces, Copy } from "lucide-react";
import ComicPanel from "./ComicPanel";
import { useJsonFormatter } from "@/hooks/useJsonFormatter";

export default function JsonFormatter() {
  const { state, handleInputChange, handleFormat, handleCopy, formattedOutput } = useJsonFormatter();

  const onFormat = useCallback(() => {
    handleFormat();
  }, [handleFormat]);

  const onCopy = useCallback(() => {
    handleCopy();
  }, [handleCopy]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      handleInputChange(e.target.value);
    },
    [handleInputChange]
  );

  return (
    <ComicPanel bgColor="bg-gray-100" badge="CODE!" badgeColor="bg-black text-white">
      <h3 className="font-display text-headline-md uppercase italic mb-4 flex items-center gap-2">
        <Braces className="w-6 h-6" />
        JSON Formatter & Validator
      </h3>
      <p className="font-body text-body-md text-gray-600 mb-4">
        Data berantakan? Rapihin JSON biar enak dibaca pas debugging!
      </p>
      <div className="flex flex-col gap-3">
        <div className="relative">
          <textarea
            value={state.input}
            onChange={onInputChange}
            placeholder='{ "status": "stres_semester_6", "tugas": "banyak" }'
            className="w-full min-h-[120px] p-3 border-4 border-black bg-white dark:bg-gray-800 font-mono text-sm outline-none resize-none"
          />
          {!state.input && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="text-center">
                <span className="text-[10px] font-body font-bold text-gray-300 dark:text-gray-600 uppercase tracking-wider">Tempel JSON atau mulai ngetik</span>
              </div>
            </div>
          )}
        </div>
        {formattedOutput.error && (
          <p className="bg-red-100 border-2 border-red-500 text-red-700 p-2 font-body font-bold text-xs">
            {formattedOutput.error}
          </p>
        )}
        <div className="flex gap-2">
          <button onClick={onFormat} className="comic-btn bg-yellow-400 text-black flex-1 text-center text-sm">
            RAPIHKAN!
          </button>
          {formattedOutput.result && (
            <button onClick={onCopy} className="comic-btn bg-black text-white flex items-center justify-center gap-1 text-sm">
              <Copy className="w-4 h-4" /> COPY
            </button>
          )}
        </div>
        {formattedOutput.result && (
          <pre className="w-full min-h-[80px] p-3 border-4 border-black bg-white font-mono text-xs overflow-auto">
            {formattedOutput.result}
          </pre>
        )}
      </div>
    </ComicPanel>
  );
}
