const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

class PrismaHeroRepository{
    // GET all heroes
    async find(){
        return prisma.hero.findMany()
    }

    // GET one hero
    async findOne(id){
        return prisma.hero.findUnique(
            {
                where: {id}
            }
        )
    }

    // CREATE
    async create(data){
        return prisma.hero.create({data})
    }

    // UPDATE
    async update(id, newData){
        return prisma.hero.update(
            {
                where: {id}, 
                data: newData
            }
        )
    }

    // DELETE
    async delete(id){
        return prisma.hero.delete(
            {
                where: {id}
            }
        )
    }
}

module.exports = PrismaHeroRepository