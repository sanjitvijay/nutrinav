import { createClient } from "@supabase/supabase-js";

const client = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_ANON_KEY);

const supabaseClient = () => client; 

export default supabaseClient;