import fs from 'node:fs/promises'
import path from 'node:path'

export async function updateEmailStatus(id, status) {
    const filePath = path.join(import.meta.dirname, '..', 'data', 'data.json')
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8')
        const data = fileContent.trim() ? JSON.parse(fileContent) : []
        const updatedData = data.map(item => item.id === id ? { ...item, emailStatus: status } : item)
        await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf-8')
    } catch (err) {
        console.error("Failed to update email status in data.json", err)
    }
}