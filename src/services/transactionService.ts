import { supabase } from './supabaseClient';

export async function recordTransaction(tx: {
  id: string;
  user_id: string;
  type: 'swap' | 'stake' | 'loan';
  asset_from: string;
  asset_to: string;
  amount_from: number;
  amount_to: number;
  currency: string;
  timestamp: string;
}) {
  return supabase.from('transactions').insert([tx]);
}

export async function getUserTransactions(user_id: string) {
  return supabase.from('transactions').select('*').eq('user_id', user_id);
} 