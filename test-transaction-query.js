// Test direct Supabase query
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zlyxqefiemtoxbxvubjn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseXhxZWZpZW10b3hieHZ1YmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTc0OTEsImV4cCI6MjA4NDM3MzQ5MX0.Oo9UlqUPiagLphn08LL5IKiHff2FclKXIhx6z2MHKtk';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);

// Test 1: Query Transaction table
async function testTransactions() {
  console.log('\n=== TEST 1: Query Transaction table ===');
  const { data, error } = await supabase
    .from('Transaction')
    .select('*')
    .limit(5);
  
  console.log('Error:', error);
  console.log('Data count:', data?.length);
  console.log('Sample data:', data?.slice(0, 2));
}

// Test 2: Query with join
async function testWithJoin() {
  console.log('\n=== TEST 2: Query with TransactionItem join ===');
  const { data, error } = await supabase
    .from('Transaction')
    .select(`
      id,
      date,
      totalAmount,
      items:TransactionItem (
        id,
        productId,
        quantity
      )
    `)
    .limit(5);
  
  console.log('Error:', error);
  console.log('Data count:', data?.length);
  console.log('Sample data:', JSON.stringify(data?.slice(0, 1), null, 2));
}

// Test 3: Filter by year 2024
async function testFilter2024() {
  console.log('\n=== TEST 3: Filter transactions in 2024 ===');
  const { data, error } = await supabase
    .from('Transaction')
    .select('id, date')
    .gte('date', '2024-01-01')
    .lt('date', '2025-01-01')
    .limit(10);
  
  console.log('Error:', error);
  console.log('2024 transactions count:', data?.length);
  console.log('Sample dates:', data?.map(t => t.date));
}

// Run all tests
(async () => {
  await testTransactions();
  await testWithJoin();
  await testFilter2024();
  console.log('\n=== TESTS COMPLETE ===');
})();
