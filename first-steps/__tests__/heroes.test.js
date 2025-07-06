const bcrypt = require('bcrypt');
const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
let token;

describe('Heroes Endpoints', () => {
    beforeAll(async () => {
        // Reset DB and create user + get token
        await prisma.hero.deleteMany();
        await prisma.user.deleteMany();
        const user = await prisma.user.create({ 
            data: { 
                email: 'hero@test.com', 
                password: await bcrypt.hash('pw', 10)
            }
        });
        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'hero@test.com', password: 'pw'});
        token = res.body.token;
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should reject withou token', async () => {
        const res = await request(app).get('/heroes');
        expect(res.statusCode).toBe(401);
    });

    it('Should get empty hero list', async () => {
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
});