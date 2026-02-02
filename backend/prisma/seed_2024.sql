-- =====================================================
-- SEED TRANSAKSI TAHUN 2024 (Jan - Des 2024)
-- =====================================================

DO $$
DECLARE
    prod RECORD;
    trans_id TEXT;
    trans_date TIMESTAMP;
    qty INT;
    subtotal INT;
    base_demand INT;
    seasonal NUMERIC;
    counter INT := 0;
BEGIN
    -- Jan 2024
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx24jan' || counter || prod.id;
            trans_date := '2024-01-' || (1 + (random()*27)::INT) || ' 10:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Jan24', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Jan 2024 done';

    -- Feb 2024
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx24feb' || counter || prod.id;
            trans_date := '2024-02-' || (1 + (random()*27)::INT) || ' 11:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Feb24', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Feb 2024 done';

    -- Mar 2024
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx24mar' || counter || prod.id;
            trans_date := '2024-03-' || (1 + (random()*27)::INT) || ' 12:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Mar24', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Mar 2024 done';

    -- Apr 2024 (seasonal 1.3x)
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := (prod."safetyStock" * 5 * 1.3)::INT;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx24apr' || counter || prod.id;
            trans_date := '2024-04-' || (1 + (random()*27)::INT) || ' 13:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Apr24', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Apr 2024 done';

    -- May 2024
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx24may' || counter || prod.id;
            trans_date := '2024-05-' || (1 + (random()*27)::INT) || ' 14:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Mei24', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Mei 2024 done';

    -- Jun 2024
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx24jun' || counter || prod.id;
            trans_date := '2024-06-' || (1 + (random()*27)::INT) || ' 15:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Jun24', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Jun 2024 done';

    -- Jul 2024
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx24jul' || counter || prod.id;
            trans_date := '2024-07-' || (1 + (random()*27)::INT) || ' 10:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Jul24', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Jul 2024 done';

    -- Aug 2024
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx24aug' || counter || prod.id;
            trans_date := '2024-08-' || (1 + (random()*27)::INT) || ' 11:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Agt24', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Agt 2024 done';

    -- Sep 2024
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx24sep' || counter || prod.id;
            trans_date := '2024-09-' || (1 + (random()*27)::INT) || ' 12:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Sep24', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Sep 2024 done';

    -- Oct 2024
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx24oct' || counter || prod.id;
            trans_date := '2024-10-' || (1 + (random()*27)::INT) || ' 13:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Okt24', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Okt 2024 done';

    -- Nov 2024
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx24nov' || counter || prod.id;
            trans_date := '2024-11-' || (1 + (random()*27)::INT) || ' 14:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Nov24', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Nov 2024 done';

    -- Dec 2024 (seasonal 1.3x)
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := (prod."safetyStock" * 5 * 1.3)::INT;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx24dec' || counter || prod.id;
            trans_date := '2024-12-' || (1 + (random()*27)::INT) || ' 15:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Des24', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Des 2024 done - Total: %', counter;
END $$;

SELECT 'Transactions 2024' as info, COUNT(*) FROM "Transaction" WHERE date >= '2024-01-01' AND date < '2025-01-01';
