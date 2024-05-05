import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
console.log();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default supabase;
