-- =====================================================
-- SEED TRANSAKSI 24 BULAN - PART 2
-- Jan 2024 - Des 2025 (SEMUA PRODUK ADA TRANSAKSI)
-- =====================================================

-- Function to generate transactions for all products
DO $$
DECLARE
    prod RECORD;
    period RECORD;
    trans_id TEXT;
    item_id TEXT;
    trans_date TIMESTAMP;
    qty INT;
    subtotal INT;
    base_demand INT;
    seasonal_boost NUMERIC;
    month_num INT;
    day_num INT;
    hour_num INT;
    trans_counter INT := 0;
BEGIN
    -- Loop through periods (24 months: Jan 2024 - Dec 2025)
    FOR period IN 
        SELECT * FROM (
            VALUES 
            ('Jan', 2024, 1), ('Feb', 2024, 2), ('Mar', 2024, 3), ('Apr', 2024, 4),
            ('Mei', 2024, 5), ('Jun', 2024, 6), ('Jul', 2024, 7), ('Agt', 2024, 8),
            ('Sep', 2024, 9), ('Okt', 2024, 10), ('Nov', 2024, 11), ('Des', 2024, 12),
            ('Jan', 2025, 1), ('Feb', 2025, 2), ('Mar', 2025, 3), ('Apr', 2025, 4),
            ('Mei', 2025, 5), ('Jun', 2025, 6), ('Jul', 2025, 7), ('Agt', 2025, 8),
            ('Sep', 2025, 9), ('Okt', 2025, 10), ('Nov', 2025, 11), ('Des', 2025, 12)
        ) AS t(month_name, year_num, month_num)
    LOOP
        -- Loop through all products
        FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product"
        LOOP
            -- Get base demand from safety stock (safety stock = 20% of base demand)
            base_demand := prod."safetyStock" * 5;
            
            -- Seasonal boost for April and December
            IF period.month_name IN ('Apr', 'Des') THEN
                seasonal_boost := 1.3;
            ELSE
                seasonal_boost := 1.0;
            END IF;
            
            -- Generate 1-3 transactions per product per month
            FOR i IN 1..((random() * 2 + 1)::INT)
            LOOP
                trans_counter := trans_counter + 1;
                trans_id := 'trx' || trans_counter::TEXT || '_' || period.year_num::TEXT || period.month_num::TEXT;
                item_id := 'ti' || trans_counter::TEXT || '_' || period.year_num::TEXT || period.month_num::TEXT;
                
                -- Random day, hour
                day_num := (random() * 27 + 1)::INT;
                hour_num := (random() * 12 + 8)::INT;
                trans_date := make_timestamp(period.year_num, period.month_num, day_num, hour_num, (random() * 59)::INT, 0);
                
                -- Random quantity based on demand
                qty := GREATEST(1, (random() * base_demand * seasonal_boost / 10)::INT);
                subtotal := qty * prod.price;
                
                -- Insert transaction
                INSERT INTO "Transaction" (id, date, "totalAmount", "createdAt", "updatedAt")
                VALUES (trans_id || '_' || prod.id, trans_date, subtotal, 
                        NOW(), NOW());
                
                -- Insert transaction item
                INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal)
                VALUES (item_id || '_' || prod.id, trans_id || '_' || prod.id, prod.id, qty, prod.price, subtotal);
            END LOOP;
        END LOOP;
        
        RAISE NOTICE 'Completed % %', period.month_name, period.year_num;
    END LOOP;
    
    RAISE NOTICE 'Total transactions created: %', trans_counter;
END $$;

-- Verify counts
SELECT 'Transactions' as table_name, COUNT(*) as count FROM "Transaction"
UNION ALL
SELECT 'TransactionItems', COUNT(*) FROM "TransactionItem"
UNION ALL
SELECT 'Products', COUNT(*) FROM "Product";
