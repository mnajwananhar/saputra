-- =====================================================
-- SEED TRANSAKSI TAHUN 2025 (Jan - Des 2025)
-- =====================================================

DO $$
DECLARE
    prod RECORD;
    trans_id TEXT;
    trans_date TIMESTAMP;
    qty INT;
    subtotal INT;
    base_demand INT;
    counter INT := 0;
BEGIN
    -- Jan 2025
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx25jan' || counter || prod.id;
            trans_date := '2025-01-' || (1 + (random()*27)::INT) || ' 10:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Jan25', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Jan 2025 done';

    -- Feb 2025
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx25feb' || counter || prod.id;
            trans_date := '2025-02-' || (1 + (random()*27)::INT) || ' 11:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Feb25', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Feb 2025 done';

    -- Mar 2025
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx25mar' || counter || prod.id;
            trans_date := '2025-03-' || (1 + (random()*27)::INT) || ' 12:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Mar25', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Mar 2025 done';

    -- Apr 2025 (seasonal 1.3x)
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := (prod."safetyStock" * 5 * 1.3)::INT;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx25apr' || counter || prod.id;
            trans_date := '2025-04-' || (1 + (random()*27)::INT) || ' 13:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Apr25', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Apr 2025 done';

    -- May 2025
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx25may' || counter || prod.id;
            trans_date := '2025-05-' || (1 + (random()*27)::INT) || ' 14:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Mei25', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Mei 2025 done';

    -- Jun 2025
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx25jun' || counter || prod.id;
            trans_date := '2025-06-' || (1 + (random()*27)::INT) || ' 15:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Jun25', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Jun 2025 done';

    -- Jul 2025
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx25jul' || counter || prod.id;
            trans_date := '2025-07-' || (1 + (random()*27)::INT) || ' 10:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Jul25', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Jul 2025 done';

    -- Aug 2025
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx25aug' || counter || prod.id;
            trans_date := '2025-08-' || (1 + (random()*27)::INT) || ' 11:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Agt25', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Agt 2025 done';

    -- Sep 2025
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx25sep' || counter || prod.id;
            trans_date := '2025-09-' || (1 + (random()*27)::INT) || ' 12:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Sep25', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Sep 2025 done';

    -- Oct 2025
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx25oct' || counter || prod.id;
            trans_date := '2025-10-' || (1 + (random()*27)::INT) || ' 13:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Okt25', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Okt 2025 done';

    -- Nov 2025
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := prod."safetyStock" * 5;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx25nov' || counter || prod.id;
            trans_date := '2025-11-' || (1 + (random()*27)::INT) || ' 14:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Nov25', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Nov 2025 done';

    -- Dec 2025 (seasonal 1.3x)
    FOR prod IN SELECT id, name, price, "safetyStock" FROM "Product" LOOP
        base_demand := (prod."safetyStock" * 5 * 1.3)::INT;
        FOR i IN 1..2 LOOP
            counter := counter + 1;
            trans_id := 'trx25dec' || counter || prod.id;
            trans_date := '2025-12-' || (1 + (random()*27)::INT) || ' 15:00:00';
            qty := GREATEST(1, (random() * base_demand / 10)::INT + 1);
            subtotal := qty * prod.price;
            INSERT INTO "Transaction" (id, date, "totalAmount", note, "createdAt", "updatedAt") VALUES (trans_id, trans_date::TIMESTAMP, subtotal, 'Des25', NOW(), NOW());
            INSERT INTO "TransactionItem" (id, "transactionId", "productId", quantity, price, subtotal) VALUES ('ti' || trans_id, trans_id, prod.id, qty, prod.price, subtotal);
        END LOOP;
    END LOOP;
    RAISE NOTICE 'Des 2025 done - Total: %', counter;
END $$;

SELECT 'Total Transactions' as info, COUNT(*) FROM "Transaction";
