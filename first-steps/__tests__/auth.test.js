const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        await prisma.$executeRaw`PRAGMA foreing_keys = OFF;`;
        await prisma.user.deleteMany();
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should register a new user', async () => {
    const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'secret' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('test@example.com');
  });

    it('should login and receive a token', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'secret' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});