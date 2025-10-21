const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PrismaHeroRepository {
    // GET todos os heróis (sem filtro de usuário)
    async findAll() {
        return prisma.hero.findMany();
    }

    // GET um herói específico por ID
    async findOne(id) {
        return prisma.hero.findUnique({
            where: { id }
        });
    }

    // CREATE novo herói
    async create(data) {
        return prisma.hero.create({
            data
        });
    }

    // UPDATE herói existente
    async update(id, newData) {
        return prisma.hero.update({
            where: { id },
            data: newData
        });
    }

    // DELETE herói
    async delete(id) {
        return prisma.hero.delete({
            where: { id }
        });
    }
}

module.exports = PrismaHeroRepository;