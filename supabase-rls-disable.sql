-- GRANT FULL PUBLIC ACCESS (RLS sudah disabled)
-- Buka: https://supabase.com/dashboard/project/zlyxqefiemtoxbxvubjn/sql/new
-- Copy paste & RUN

-- Grant ALL privileges ke anon dan authenticated roles
GRANT ALL ON TABLE public."User" TO anon, authenticated;
GRANT ALL ON TABLE public."Supplier" TO anon, authenticated;
GRANT ALL ON TABLE public."Product" TO anon, authenticated;
GRANT ALL ON TABLE public."Transaction" TO anon, authenticated;
GRANT ALL ON TABLE public."TransactionItem" TO anon, authenticated;
GRANT ALL ON TABLE public."StockIn" TO anon, authenticated;
GRANT ALL ON TABLE public."HistoricalData" TO anon, authenticated;

-- Grant sequence access
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Verify grants
SELECT grantee, privilege_type, table_name
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee;
