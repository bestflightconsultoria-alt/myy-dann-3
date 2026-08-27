import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xeaifqmivirunbhfskeo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlYWlmcW1pdmlydW5iaGZza2VvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NTIyMDksImV4cCI6MjEwMzQyODIwOX0.Z7q2Q27KGtzz-ba5e8nTErHxPg8OnJYwEqRSAudpNA8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
