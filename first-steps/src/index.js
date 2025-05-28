const path = require('path')
const HeroRepository = require('./heroRepository')

async function demoFinds(){
    const repo = new HeroRepository({
        file: path.resolve(__dirname, '../database/data.json')
    });

    const allHeroes = await repo.find();
    console.log('All heroes: ', allHeroes)
}

demoFinds().catch(err => console.error(err));
