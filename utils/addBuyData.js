import { nanoid } from 'nanoid'
import fs from 'node:fs/promises'
import path from 'node:path'
export async function addBuyData(data, dir) {
    const filePath = path.join(dir, 'data', 'data.json')
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    let existingData = []
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8')
        existingData = JSON.parse(fileContent)
    } catch (error) {
       console.log("No existing data.json found, starting a fresh array!")
    }

    try {
        data.id = nanoid();
        data.timeStamp = new Date().toISOString()
        data.emailStatus = "pending"
        const newData = [...existingData, data]
        await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf-8')
    } catch (error) {
        throw new Error('Error writing buy data', { cause: error })
    }
}