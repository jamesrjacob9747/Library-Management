'use strict';

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/prisma');

jest.mock('../src/config/prisma', () => ({
  issuance: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  member: {
    findUnique: jest.fn(),
  },
  book: {
    findUnique: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
}));

describe('Issuance Management API', () => {
  const TEST_API_KEY = 'test-secret-key';

  beforeAll(() => {
    process.env.API_KEY = TEST_API_KEY;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/issuance', () => {
    it('should list issuances filtered by status', async () => {
      const mockIssuances = [
        { issuance_id: 101, issuance_status: 'issued', target_return_date: '2026-08-10' },
      ];
      prisma.issuance.count.mockResolvedValue(1);
      prisma.issuance.findMany.mockResolvedValue(mockIssuances);

      const res = await request(app)
        .get('/api/issuance?status=issued')
        .set('X-API-Key', TEST_API_KEY);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/issuance', () => {
    it('should create an issuance record when member and book exist', async () => {
      prisma.member.findUnique.mockResolvedValue({ mem_id: 1, mem_name: 'Alice' });
      prisma.book.findUnique.mockResolvedValue({ book_id: 2, book_name: 'Clean Code' });
      prisma.issuance.create.mockResolvedValue({
        issuance_id: 50,
        book_id: 2,
        issuance_member: 1,
        issuance_status: 'issued',
        target_return_date: new Date('2026-08-15'),
      });

      const res = await request(app)
        .post('/api/issuance')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          book_id: 2,
          issuance_member: 1,
          target_return_date: '2026-08-15',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.issuance_id).toEqual(50);
    });

    it('should return 404 if member does not exist', async () => {
      prisma.member.findUnique.mockResolvedValue(null);
      prisma.book.findUnique.mockResolvedValue({ book_id: 2, book_name: 'Clean Code' });

      const res = await request(app)
        .post('/api/issuance')
        .set('X-API-Key', TEST_API_KEY)
        .send({
          book_id: 2,
          issuance_member: 999,
          target_return_date: '2026-08-15',
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toMatch(/Member not found/i);
    });
  });

  describe('PUT /api/issuance/:id', () => {
    it('should update issuance status to returned', async () => {
      prisma.issuance.findUnique.mockResolvedValue({ issuance_id: 50, issuance_status: 'issued' });
      prisma.issuance.update.mockResolvedValue({ issuance_id: 50, issuance_status: 'returned' });

      const res = await request(app)
        .put('/api/issuance/50')
        .set('X-API-Key', TEST_API_KEY)
        .send({ issuance_status: 'returned' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.issuance_status).toEqual('returned');
    });
  });
});
