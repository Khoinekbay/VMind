import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gbsnriqieystfsjeubeu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdic25yaXFpZXlzdGZzamV1YmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTU4MjAsImV4cCI6MjA4MDIzMTgyMH0.rTg0cuGqsYG9x2UMNhoL5tX4mxE_5P3Gk3UwVyIJlm8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);