'use strict';

const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/prisma');

jest.mock('../src/config/prisma', () => ({
  member: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
}));

describe('Member Management API', () => {
  const TEST_API_KEY = 'test-secret-key';

  beforeAll(() => {
    process.env.API_KEY = TEST_API_KEY;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/member', () => {
    it('should return a paginated list of members', async () => {
      const mockMembers = [
        { mem_id: 1, mem_name: 'Alice Smith', mem_email: 'alice@example.com' },
        { mem_id: 2, mem_name: 'Bob Jones', mem_email: 'bob@example.com' },
      ];
      prisma.member.count.mockResolvedValue(2);
      prisma.member.findMany.mockResolvedValue(mockMembers);

      const res = await request(app)
        .get('/api/member?page=1&limit=10')
        .set('X-API-Key', TEST_API_KEY);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination).toMatchObject({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter members by search query', async () => {
      prisma.member.count.mockResolvedValue(1);
      prisma.member.findMany.mockResolvedValue([
        { mem_id: 1, mem_name: 'Alice Smith', mem_email: 'alice@example.com' },
      ]);

      const res = await request(app)
        .get('/api/member?search=Alice')
        .set('X-API-Key', TEST_API_KEY);

      expect(res.statusCode).toEqual(200);
      expect(prisma.member.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { mem_name: { contains: 'Alice', mode: 'insensitive' } },
              { mem_email: { contains: 'Alice', mode: 'insensitive' } },
            ],
          },
        })
      );
    });
  });

  describe('GET /api/member/:id', () => {
    it('should return member details when ID exists', async () => {
      const mockMember = { mem_id: 1, mem_name: 'Alice Smith', mem_email: 'alice@example.com' };
      prisma.member.findUnique.mockResolvedValue(mockMember);

      const res = await request(app)
        .get('/api/member/1')
        .set('X-API-Key', TEST_API_KEY);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.mem_name).toEqual('Alice Smith');
    });

    it('should return 404 when member ID does not exist', async () => {
      prisma.member.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/member/999')
        .set('X-API-Key', TEST_API_KEY);

      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Member not found/i);
    });
  });

  describe('POST /api/member', () => {
    it('should create a new member successfully', async () => {
      const newMemberData = {
        mem_name: 'Charlie Brown',
        mem_email: 'charlie@example.com',
        mem_phone: '555-1234',
      };
      const createdMember = { mem_id: 3, ...newMemberData };

      prisma.member.create.mockResolvedValue(createdMember);

      const res = await request(app)
        .post('/api/member')
        .set('X-API-Key', TEST_API_KEY)
        .send(newMemberData);

      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.mem_id).toEqual(3);
    });

    it('should return 400 Bad Request when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/member')
        .set('X-API-Key', TEST_API_KEY)
        .send({ mem_name: '' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/required/i);
    });
  });
});
