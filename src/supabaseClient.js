import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lhpowwbyisyelwtrgjje.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_KsqqVQ0Xzx86ttt24QjpNA_XB5MpkI7';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
