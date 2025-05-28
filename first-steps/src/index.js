const path = require('path')
const HeroRepository = require('./heroRepository')

async function demoFinds(){
    const repo = new HeroRepository({
        file: path.resolve(__dirname, '../database/data.json')
    });

    const allHeroes = await repo.find();
    console.log('All heroes: ', allHeroes)

    const youngHeroes = (await repo.find()).filter(y => y.age >= 35);
    console.log('Young Heroes: ', youngHeroes)
}

demoFinds().catch(err => console.error(err));
