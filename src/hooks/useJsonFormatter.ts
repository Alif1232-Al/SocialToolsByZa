"use client";

import { useState, useCallback, useMemo } from "react";
import { formatJson } from "@/utils/jsonUtils";
import type { JsonFormatterState } from "@/utils";

export function useJsonFormatter() {
  const [state, setState] = useState<JsonFormatterState>({
    input: "",
    output: "",
    error: null,
  });

  const handleInputChange = useCallback((value: string) => {
    setState((prev) => ({ ...prev, input: value }));
  }, []);

  const handleFormat = useCallback(() => {
    setState((prev) => {
      const { result, error } = formatJson(prev.input);
      return { ...prev, output: result, error };
    });
  }, []);

  const formattedOutput = useMemo(() => {
    if (!state.input.trim()) return { result: "", error: null };
    return formatJson(state.input);
  }, [state.input]);

  const handleCopy = useCallback(() => {
    if (formattedOutput.result) {
      navigator.clipboard.writeText(formattedOutput.result);
    }
  }, [formattedOutput.result]);

  return {
    state,
    setState,
    handleInputChange,
    handleFormat,
    handleCopy,
    formattedOutput,
  };
}
