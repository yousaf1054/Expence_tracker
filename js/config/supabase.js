const SUPABASE_URL = "https://ypnvvkowzznsefzyinsf.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_bPGVQdgHmWXHzvHX86KsEQ_7bvOeG7c";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);