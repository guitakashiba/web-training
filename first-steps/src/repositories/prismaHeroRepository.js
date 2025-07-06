const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class PrismaHeroRepository{
    // GET all heroes belonging to a specifc user
    async findAllByUser(userId){
        return prisma.hero.findMany({
            where: { userId }
        });
    }

    // GET a single hero by ID
    async findOne(id){
        return prisma.hero.findUnique({
            where: { id }
        });
    }

    async create(data){
        return prisma.hero.create({
            data
        });
    }

    async update(id, newData){
        return prisma.hero.update({
            where: { id }, 
            data: newData
        });
    }

    async delete(id){
        return prisma.hero.delete({
            where: { id }
        });
    }
}

module.exports = PrismaHeroRepository