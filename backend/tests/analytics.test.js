'use strict';

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/prisma');

jest.mock('../src/config/prisma', () => ({
  $queryRaw: jest.fn(),
  $connect: jest.fn(),
  $disconnect: jest.fn(),
}));

describe('Analytics API', () => {
  const TEST_API_KEY = 'test-secret-key';

  beforeAll(() => {
    process.env.API_KEY = TEST_API_KEY;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /api/analytics/books-never-borrowed should return unborrowed books', async () => {
    const mockData = [
      { 'Book Name': 'Unread Novel', 'Author/Category': 'Fiction' },
    ];
    prisma.$queryRaw.mockResolvedValue(mockData);

    const res = await request(app)
      .get('/api/analytics/books-never-borrowed')
      .set('X-API-Key', TEST_API_KEY);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toEqual(1);
    expect(res.body.data).toEqual(mockData);
  });

  it('GET /api/analytics/outstanding-books should return active issuances', async () => {
    const mockData = [
      {
        'Member Name': 'Alice',
        'Book Name': 'Clean Code',
        'Issued Date': '2026-08-01',
        'Target Return Date': '2026-08-10',
        Category: 'Technology',
      },
    ];
    prisma.$queryRaw.mockResolvedValue(mockData);

    const res = await request(app)
      .get('/api/analytics/outstanding-books')
      .set('X-API-Key', TEST_API_KEY);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toEqual(1);
  });

  it('GET /api/analytics/top-borrowed-books should return top 10 ranked books', async () => {
    const mockData = [
      {
        'Book Name': 'Harry Potter',
        'Number of Times Borrowed': '15',
        'Number of Members that Borrowed It': '10',
      },
    ];
    prisma.$queryRaw.mockResolvedValue(mockData);

    const res = await request(app)
      .get('/api/analytics/top-borrowed-books')
      .set('X-API-Key', TEST_API_KEY);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toEqual(1);
  });
});
