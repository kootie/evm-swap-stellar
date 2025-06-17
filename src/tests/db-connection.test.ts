import { supabase } from '../services/supabaseClient';

describe('Database Connection Test', () => {
  it('should connect to Supabase', async () => {
    const { data, error } = await supabase.from('users').select('count');
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should create and delete a test user', async () => {
    const testUser = {
      email: 'test@example.com',
      country: 'KE',
      wallet_address: '0x1234567890abcdef'
    };

    // Create user
    const { data: createData, error: createError } = await supabase
      .from('users')
      .insert([testUser])
      .select();

    expect(createError).toBeNull();
    expect(createData).toBeDefined();
    expect(createData?.[0].email).toBe(testUser.email);

    // Delete user
    if (createData?.[0].id) {
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', createData[0].id);

      expect(deleteError).toBeNull();
    }
  });
}); 