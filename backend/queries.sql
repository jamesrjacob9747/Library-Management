-- ============================================================
-- Library Management System - Analytics SQL Queries
-- Matches actual schema from ER diagram
-- ============================================================

-- ─── Query 1: Books Never Borrowed ──────────────────────────
SELECT
  b.book_name   AS "Book Name",
  c.cat_name    AS "Category"
FROM book b
LEFT JOIN issuance i ON b.book_id = i.book_id
LEFT JOIN category c ON b.book_cat_id = c.cat_id
WHERE i.issuance_id IS NULL
ORDER BY b.book_name;


-- ─── Query 2: Outstanding Books ─────────────────────────────
SELECT
  m.mem_name              AS "Member Name",
  b.book_name             AS "Book Name",
  i.issuance_date         AS "Issued Date",
  i.target_return_date    AS "Target Return Date",
  c.cat_name              AS "Category"
FROM issuance i
JOIN member   m ON i.issuance_member = m.mem_id
JOIN book     b ON i.book_id = b.book_id
JOIN category c ON b.book_cat_id = c.cat_id
WHERE i.issuance_status != 'returned'
ORDER BY i.target_return_date ASC;


-- ─── Query 3: Top 10 Most Borrowed Books ────────────────────
SELECT
  b.book_name                       AS "Book Name",
  COUNT(i.issuance_id)              AS "Number of Times Borrowed",
  COUNT(DISTINCT i.issuance_member) AS "Number of Members that Borrowed It"
FROM book b
JOIN issuance i ON b.book_id = i.book_id
GROUP BY b.book_id, b.book_name
ORDER BY COUNT(i.issuance_id) DESC
LIMIT 10;
