import { supabase } from './supabaseClient';

export async function createUser(profile: { id: string; email: string; country: string }) {
  return supabase.from('users').insert([profile]);
}

export async function getUser(id: string) {
  return supabase.from('users').select('*').eq('id', id).single();
} 