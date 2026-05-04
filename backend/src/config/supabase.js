import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("SUPABASE URL:", url ? "FOUND" : "MISSING");
console.log("SUPABASE KEY:", key ? "FOUND" : "MISSING");

export const isSupabaseReady = Boolean(url && key);

export const supabase = isSupabaseReady
  ? createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;