const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Heroes Endpoints (No Auth)', () => {
    beforeAll(async () => {
        // Limpa apenas a tabela de heróis
        await prisma.hero.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should get an empty hero list initially', async () => {
        const res = await request(app).get('/heroes');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('should create a new hero', async () => {
        const res = await request(app)
            .post('/heroes')
            .send({ name: 'TestHero', age: 99, power: 'Testing' });
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('TestHero');
        expect(res.body.age).toBe(99);
        expect(res.body.power).toBe('Testing');
    });

    it('should get all heroes', async () => {
        const res = await request(app).get('/heroes');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get a hero by id', async () => {
        // Cria um herói primeiro
        const createRes = await request(app)
            .post('/heroes')
            .send({ name: 'GetTest', age: 50, power: 'Retrieval' });
        
        const heroId = createRes.body.id;

        // Busca o herói
        const res = await request(app).get(`/heroes/${heroId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(heroId);
        expect(res.body.name).toBe('GetTest');
    });

    it('should update a hero', async () => {
        // Cria um herói
        const createRes = await request(app)
            .post('/heroes')
            .send({ name: 'UpdateTest', age: 30, power: 'Change' });
        
        const heroId = createRes.body.id;

        // Atualiza o herói
        const res = await request(app)
            .put(`/heroes/${heroId}`)
            .send({ age: 35 });
        
        expect(res.statusCode).toBe(200);
        expect(res.body.age).toBe(35);
        expect(res.body.name).toBe('UpdateTest');
    });

    it('should delete a hero', async () => {
        // Cria um herói
        const createRes = await request(app)
            .post('/heroes')
            .send({ name: 'DeleteTest', age: 40, power: 'Vanish' });
        
        const heroId = createRes.body.id;

        // Deleta o herói
        const res = await request(app).delete(`/heroes/${heroId}`);
        expect(res.statusCode).toBe(204);

        // Confirma que foi deletado
        const getRes = await request(app).get(`/heroes/${heroId}`);
        expect(getRes.statusCode).toBe(404);
    });

    it('should return 404 for non-existent hero', async () => {
        const res = await request(app).get('/heroes/99999');
        expect(res.statusCode).toBe(404);
    });
});