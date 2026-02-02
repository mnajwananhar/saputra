// Test full query seperti di app
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zlyxqefiemtoxbxvubjn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseXhxZWZpZW10b3hieHZ1YmpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3OTc0OTEsImV4cCI6MjA4NDM3MzQ5MX0.Oo9UlqUPiagLphn08LL5IKiHff2FclKXIhx6z2MHKtk";

const supabase = createClient(supabaseUrl, supabaseKey);

// Test EXACT query dari app
async function testExactAppQuery() {
  console.log("=== EXACT QUERY FROM APP ===");
  const { data, error } = await supabase
    .from("Transaction")
    .select(
      `
      id,
      date,
      totalAmount,
      createdAt,
      updatedAt,
      items:TransactionItem (
        id,
        productId,
        quantity,
        price,
        subtotal,
        Product (
          id,
          name,
          unit,
          price,
          cost
        )
      )
    `,
    )
    .order("date", { ascending: false })
    .limit(5);

  console.log("Error:", error);
  console.log("Data count:", data?.length || 0);

  if (data && data.length > 0) {
    console.log("First transaction full:", JSON.stringify(data[0], null, 2));
  } else {
    console.log("NO DATA!");
  }
}

testExactAppQuery();
