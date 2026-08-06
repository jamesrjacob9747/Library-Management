'use strict';

const request = require('supertest');
const app = require('../src/app');

// Mock Prisma database client to avoid requiring active DB connection during unit testing
jest.mock('../src/config/prisma', () => ({
  member: {
    findMany: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
}));

describe('API Key Authentication Middleware', () => {
  const TEST_API_KEY = 'test-secret-key';

  beforeAll(() => {
    process.env.API_KEY = TEST_API_KEY;
  });

  it('should deny access (401) when X-API-Key header is missing', async () => {
    const res = await request(app).get('/api/member');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toEqual('Unauthorized');
    expect(res.body.message).toMatch(/Missing API key/i);
  });

  it('should deny access (401) when X-API-Key header is invalid', async () => {
    const res = await request(app)
      .get('/api/member')
      .set('X-API-Key', 'wrong-invalid-key');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toEqual('Unauthorized');
    expect(res.body.message).toMatch(/Invalid API key/i);
  });

  it('should allow access (200) when valid X-API-Key header is provided', async () => {
    const res = await request(app)
      .get('/api/member')
      .set('X-API-Key', TEST_API_KEY);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
