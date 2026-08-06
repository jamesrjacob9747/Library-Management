'use strict';

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/prisma');

jest.mock('../src/config/prisma', () => ({
  book: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
}));

describe('Book Management API', () => {
  const TEST_API_KEY = 'test-secret-key';

  beforeAll(() => {
    process.env.API_KEY = TEST_API_KEY;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/book', () => {
    it('should return list of books paginated', async () => {
      const mockBooks = [
        { book_id: 1, book_name: 'Clean Code', book_publisher: 'Prentice Hall' },
      ];
      prisma.book.count.mockResolvedValue(1);
      prisma.book.findMany.mockResolvedValue(mockBooks);

      const res = await request(app)
        .get('/api/book')
        .set('X-API-Key', TEST_API_KEY);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('POST /api/book', () => {
    it('should create a new book when valid payload is sent', async () => {
      const newBook = {
        book_name: 'Design Patterns',
        book_cat_id: 1,
        book_collection_id: 1,
        book_publisher: 'Addison-Wesley',
      };
      prisma.book.create.mockResolvedValue({ book_id: 10, ...newBook });

      const res = await request(app)
        .post('/api/book')
        .set('X-API-Key', TEST_API_KEY)
        .send(newBook);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.book_id).toEqual(10);
    });

    it('should fail with 400 when missing required category or collection', async () => {
      const res = await request(app)
        .post('/api/book')
        .set('X-API-Key', TEST_API_KEY)
        .send({ book_name: 'Incomplete Book' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
    });
  });
});
