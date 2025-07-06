const bcrypt = require('bcrypt');
const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let token;

describe('Heroes Endpoints', () => {
    beforeAll(async () => {
        // Reset tables and create User A
        await prisma.hero.deleteMany();
        await prisma.user.deleteMany();

        await prisma.user.create({
            data: {
                email: 'hero@test.com',
                password: await bcrypt.hash('pw', 10)
            }
        });

        // Log in User A to get a token
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'hero@test.com', password: 'pw' });
        token = res.body.token;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should reject without token', async () => {
        const res = await request(app).get('/heroes');
        expect(res.statusCode).toBe(401);
    });

    it('should get an empty hero list for User A', async () => {
        const res = await request(app)
            .get('/heroes')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('should create, update, and delete a hero', async () => {
        // Create
        let res = await request(app)
            .post('/heroes')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'TestHero', age: 99, power: 'Testing' });
        expect(res.statusCode).toBe(201);
        const hero = res.body;

        // Update
        res = await request(app)
            .put(`/heroes/${hero.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ age: 100 });
        expect(res.statusCode).toBe(200);
        expect(res.body.age).toBe(100);

        // Delete
        res = await request(app)
            .delete(`/heroes/${hero.id}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(204);
    });

    describe('Ownership rules', () => {
        let heroId;
        let tokenB;

        beforeAll(async () => {
            // User A creates a hero
            const resCreate = await request(app)
                .post('/heroes')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'OwnedHero', age: 50, power: 'AuthTest' });
            heroId = resCreate.body.id;

            // Create and log in User B
            await prisma.user.create({
                data: {
                    email: 'other@test.com',
                    password: await bcrypt.hash('pw2', 10)
                }
            });
            const resLoginB = await request(app)
                .post('/auth/login')
                .send({ email: 'other@test.com', password: 'pw2' });
            tokenB = resLoginB.body.token;
        });

        it('forbids a different user from deleting that hero', async () => {
            const res = await request(app)
                .delete(`/heroes/${heroId}`)
                .set('Authorization', `Bearer ${tokenB}`);
            expect(res.statusCode).toBe(403);
        });

        it('allows the owner to delete their own hero', async () => {
            const res = await request(app)
                .delete(`/heroes/${heroId}`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(204);
        });
    });
});
