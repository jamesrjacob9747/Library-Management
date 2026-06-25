-- ============================================================
-- Library Management System - Analytics SQL Queries
-- ============================================================

-- ─── Query 1: Books Never Borrowed ──────────────────────────
-- Retrieves all books that have never been borrowed.

SELECT
  b.title   AS "Book Name",
  b.author  AS "Author"
FROM books b
LEFT JOIN issuances i ON b.id = i.book_id
WHERE i.id IS NULL
ORDER BY b.title;


-- ─── Query 2: Outstanding Books ─────────────────────────────
-- Lists all books currently issued and not yet returned.

SELECT
  m.name                 AS "Member Name",
  b.title                AS "Book Name",
  i.issued_date          AS "Issued Date",
  i.target_return_date   AS "Target Return Date",
  b.author               AS "Author"
FROM issuances i
JOIN members m ON i.member_id = m.id
JOIN books   b ON i.book_id   = b.id
WHERE i.actual_return_date IS NULL
ORDER BY i.target_return_date ASC;


-- ─── Query 3: Top 10 Most Borrowed Books ────────────────────
-- Identifies the top 10 most frequently borrowed books.

SELECT
  b.title                             AS "Book Name",
  COUNT(i.id)                         AS "Number of Times Borrowed",
  COUNT(DISTINCT i.member_id)         AS "Number of Members that Borrowed It"
FROM books b
JOIN issuances i ON b.id = i.book_id
GROUP BY b.id, b.title
ORDER BY COUNT(i.id) DESC
LIMIT 10;
