const {readFile, writeFile} = require('fs/promises')

class HeroRepository{
    constructor({file}){
        this.file = file
    }

    async _currentFileContent(){
        const text = await readFile(this.file, 'utf-8')
        return JSON.parse(text)
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
        const all = await this._currentFileContent();
        if(!Array.isArray(all)){
            throw new Error(`Expected data.json to be an array but go ${typeof all}`)
        }

        const id = typeof itemId === 'string' ? parseInt(itemId, 10) : itemId

        const idx = all.findIndex(h => h.id === id)
        if(idx === -1) return null

        const [deleted] = all.splice(idx, 1);

        await writeFile(this.file, JSON.stringify(all, null, 2))
        
        return deleted
    }

    async update(itemId, newData){
        const all = await this._currentFileContent();
        if(!Array.isArray(all)){
            throw new Error(`Expected data.json to be an array but go ${typeof all}`)
        }

        const id = typeof itemId === 'string' ? parseInt(itemId, 10) : itemId

        const idx = all.findIndex(h => h.id === id)
        if(idx === -1) return null
        
        const existing = all[idx]
        const updated = {...existing, ...newData}
        all[idx] = updated

        await writeFile(this.file, JSON.stringify(all, null, 2), 'utf-8')

        return updated
    }

}

module.exports = HeroRepository
