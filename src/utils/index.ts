export interface JsonFormatterState {
  input: string;
  output: string;
  error: string | null;
}

export { formatJson } from "@/utils/jsonUtils";
