const {readFile, writeFile} = require('fs/promises')

class HeroRepository{
    constructor({file}){
        this.file = file
    }

    async _currentFileContent(){
        return JSON.parse(await readFile(this.file))
    }

    async find(itemId){
        const all = await this._currentFileContent()
        if(!itemId) return all;

        const searchId = typeof itemId === 'string'
        ? parseInt(itemId, 10)
        : itemId;

        return all.find(({id}) => id === searchId)
    }

    async create(data){
        const currentFile = await this._currentFileContent()
        currentFile.push(data)

        await writeFile(this.file, JSON.stringify(currentFile))
    }

    async delete(itemId){
        const all = this._currentFileContent()
        const index = all.find(({id}) => id === itemId)
        if(index === -1) return null

        const [deleteItem] = all.splice(index, 1);
        await writeFile(this.file, JSON.stringify(all, null, 2))
        
        return deleteItem
    }

    async update(itemId, newData){
        const all = this._currentFileContent()
        const index = all.find(({id}) => id === itemId)
        if(index === -1) return null

        const existing = all[index]
        const updated = {...existing, ...newData}
        all[index] = updated

        await writeFile(this.file, JSON.stringify(all, null, 2))

        return updated
    }

}

module.exports = HeroRepository
