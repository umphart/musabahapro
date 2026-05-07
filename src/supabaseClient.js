import { createClient } from '@supabase/supabase-js';

// New Supabase credentials
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://wmmlqhooafmmnyuaxfjz.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtbWxxaG9vYWZtbW55dWF4Zmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNjcyNzUsImV4cCI6MjA5MzY0MzI3NX0.zLAsj8i42q_0dZ5obCtpXIW45XMbtC3dk9YFG86s-IU';

console.log('Connecting to Supabase URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);