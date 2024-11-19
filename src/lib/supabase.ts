import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase-types"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
  );
}
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export function getStorageURL(path: string | null) {
  if (path === null) return null;
  const URL = supabaseUrl + "/storage/v1/object/public/" + path;
  return URL;
}
