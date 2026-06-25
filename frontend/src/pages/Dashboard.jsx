import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { format, differenceInDays, parseISO } from 'date-fns';

const today = new Date().toISOString().split('T')[0];

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(today);
  const [issuances, setIssuances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchPending = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/issuance', {
        params: { status: 'active', limit: 100 },
      });
      setIssuances(res.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  // Filter by selected date and search term
  const filtered = issuances.filter((item) => {
    const matchDate = !selectedDate || item.target_return_date <= selectedDate;
    const term = search.toLowerCase();
    const matchSearch =
      !term ||
      item.member?.name?.toLowerCase().includes(term) ||
      item.book?.title?.toLowerCase().includes(term);
    return matchDate && matchSearch;
  });

  const getDaysOverdue = (targetDate) => {
    const diff = differenceInDays(new Date(), parseISO(targetDate));
    return diff > 0 ? diff : 0;
  };

  const handleExportCSV = () => {
    const headers = ['Member Name', 'Book Name', 'Issued Date', 'Target Return Date', 'Days Overdue'];
    const rows = filtered.map((i) => [
      i.member?.name,
      i.book?.title,
      i.issued_date,
      i.target_return_date,
      getDaysOverdue(i.target_return_date),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pending-returns-${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>📚 Library Management System</h1>
        <p style={styles.subtitle}>Pending Book Returns Dashboard</p>
      </div>

      <div style={styles.controls}>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Filter by Return Date (on or before)</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Search by Member or Book</label>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.controlGroup}>
          <label style={styles.label}>&nbsp;</label>
          <div style={styles.btnRow}>
            <button onClick={fetchPending} style={styles.btnPrimary}>↺ Refresh</button>
            <button onClick={handleExportCSV} style={styles.btnSecondary}>⬇ Export CSV</button>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div style={styles.summaryBar}>
        <span style={styles.summaryItem}>Total Pending: <strong>{filtered.length}</strong></span>
        <span style={styles.summaryItem}>
          Overdue: <strong style={{ color: '#dc2626' }}>
            {filtered.filter((i) => getDaysOverdue(i.target_return_date) > 0).length}
          </strong>
        </span>
        <span style={styles.summaryItem}>
          Due Today: <strong style={{ color: '#d97706' }}>
            {filtered.filter((i) => i.target_return_date === today).length}
          </strong>
        </span>
      </div>

      {/* Table */}
      <div style={styles.tableWrapper}>
        {loading && <div style={styles.status}>Loading...</div>}
        {error && <div style={{ ...styles.status, color: '#dc2626' }}>Error: {error}</div>}
        {!loading && !error && (
          <table style={styles.table}>
            <thead>
              <tr>
                {['#', 'Member Name', 'Book Name', 'Issued Date', 'Target Return Date', 'Days Overdue', 'Status'].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={styles.empty}>No pending returns found.</td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const overdue = getDaysOverdue(item.target_return_date);
                  const isDueToday = item.target_return_date === today;
                  const rowStyle = overdue > 0
                    ? { ...styles.tr, backgroundColor: '#fef2f2' }
                    : isDueToday
                    ? { ...styles.tr, backgroundColor: '#fffbeb' }
                    : styles.tr;

                  return (
                    <tr key={item.id} style={rowStyle}>
                      <td style={styles.td}>{idx + 1}</td>
                      <td style={styles.td}>{item.member?.name || '—'}</td>
                      <td style={{ ...styles.td, fontWeight: 500 }}>{item.book?.title || '—'}</td>
                      <td style={styles.td}>{item.issued_date}</td>
                      <td style={styles.td}>{item.target_return_date}</td>
                      <td style={{ ...styles.td, color: overdue > 0 ? '#dc2626' : '#374151', fontWeight: overdue > 0 ? 700 : 400 }}>
                        {overdue > 0 ? `${overdue} days` : '—'}
                      </td>
                      <td style={styles.td}>
                        {overdue > 0 ? (
                          <span style={styles.badgeOverdue}>Overdue</span>
                        ) : isDueToday ? (
                          <span style={styles.badgeToday}>Due Today</span>
                        ) : (
                          <span style={styles.badgeActive}>Active</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { fontFamily: 'system-ui, sans-serif', maxWidth: 1200, margin: '0 auto', padding: '24px 16px', color: '#111827' },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, margin: 0, color: '#1e3a5f' },
  subtitle: { color: '#6b7280', margin: '4px 0 0' },
  controls: { display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16, background: '#f9fafb', padding: 16, borderRadius: 8, border: '1px solid #e5e7eb' },
  controlGroup: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 180 },
  label: { fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, outline: 'none' },
  btnRow: { display: 'flex', gap: 8, marginTop: 2 },
  btnPrimary: { padding: '8px 16px', background: '#1e3a5f', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  btnSecondary: { padding: '8px 16px', background: '#fff', color: '#374151', border: '1px solid #d1d5db', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  summaryBar: { display: 'flex', gap: 24, marginBottom: 16, padding: '12px 16px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' },
  summaryItem: { fontSize: 14, color: '#374151' },
  tableWrapper: { overflowX: 'auto', borderRadius: 8, border: '1px solid #e5e7eb' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: { padding: '12px 16px', textAlign: 'left', background: '#f3f4f6', fontWeight: 600, color: '#374151', borderBottom: '2px solid #e5e7eb', whiteSpace: 'nowrap' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '12px 16px', color: '#374151' },
  empty: { padding: '40px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 14 },
  status: { padding: 24, textAlign: 'center', color: '#6b7280' },
  badgeOverdue: { background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 },
  badgeToday: { background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 },
  badgeActive: { background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 },
};
