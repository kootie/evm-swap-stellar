import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import { PostgrestResponse } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { createUser, getUser } from '../services/userService';
import { recordTransaction, getUserTransactions } from '../services/transactionService';

interface TestUser {
  id: string;
  email: string;
  country: string;
}

interface TestTransaction {
  id: string;
  user_id: string;
  type: 'swap' | 'stake' | 'loan';
  asset_from: string;
  asset_to: string;
  amount_from: number;
  amount_to: number;
  currency: string;
  timestamp: string;
}

describe('Supabase Integration Tests', () => {
  const testUser: TestUser = {
    id: crypto.randomUUID(),
    email: 'test@example.com',
    country: 'KE'
  };

  const testTransaction: TestTransaction = {
    id: crypto.randomUUID(),
    user_id: '',
    type: 'swap',
    asset_from: 'BTC',
    asset_to: 'ETH',
    amount_from: 1.5,
    amount_to: 25.0,
    currency: 'USD',
    timestamp: new Date().toISOString()
  };

  let userId: string;

  beforeAll(async () => {
    // Clean up any existing test data
    await supabase.from('transactions').delete().eq('user_id', userId);
    await supabase.from('users').delete().eq('email', testUser.email);
  });

  it('should create a new user', async () => {
    const { data, error } = await createUser(testUser);
    expect(error).toBeNull();
    expect(data).toBeDefined();
    if (data) {
      const users = data as unknown as TestUser[];
      if (users.length > 0) {
        const user = users[0];
        expect(user.email).toBe(testUser.email);
        userId = user.id;
        testTransaction.user_id = userId;
      }
    }
  });

  it('should retrieve user data', async () => {
    const { data, error } = await getUser(userId);
    expect(error).toBeNull();
    expect(data).toBeDefined();
    if (data) {
      const user = data as TestUser;
      expect(user.email).toBe(testUser.email);
      expect(user.country).toBe(testUser.country);
    }
  });

  it('should record a transaction', async () => {
    const { data, error } = await recordTransaction(testTransaction);
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should retrieve user transactions', async () => {
    const { data, error } = await getUserTransactions(userId);
    expect(error).toBeNull();
    expect(data).toBeDefined();
    if (data) {
      const transactions = data as unknown as TestTransaction[];
      if (transactions.length > 0) {
        const transaction = transactions[0];
        expect(transaction.type).toBe(testTransaction.type);
      }
    }
  });

  afterAll(async () => {
    // Clean up test data
    await supabase.from('transactions').delete().eq('user_id', userId);
    await supabase.from('users').delete().eq('id', userId);
  });
}); 