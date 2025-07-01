// /src/services/supabase.ts: 

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cxxjbddsthxysvswftpb.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4eGpiZGRzdGh4eXN2c3dmdHBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNjkzMzcsImV4cCI6MjA2Njk0NTMzN30.LR57QAf0QEz6oW-xTPk48X3Mo5sYVWVeD1QdAooWv6g'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 