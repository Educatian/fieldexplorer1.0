// Landing page auth module
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables!');
}

export const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

// Auth functions
export async function signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured');
    return await supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured');
    return await supabase.auth.signUp({ email, password });
}

export async function getSession() {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session;
}

export async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
}
