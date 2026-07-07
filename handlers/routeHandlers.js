import { boughtEvents } from '../events/boughtEvents.js'
import { addBuyData } from '../utils/addBuyData.js'
import { getGoldPrice } from '../utils/getGoldPrice.js'
import { parsedJsonBody } from '../utils/parseJsonBody.js'
import { sendPrice } from '../utils/sendPrice.js'
import { sendResponse } from '../utils/sendResponse.js'

export function handleChangeGoldPrice(res) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    sendPrice(res, getGoldPrice())

    const intervalId = setInterval(() => {
        sendPrice(res, getGoldPrice())
    }, 3000)


    res.on('close', () => {
        clearInterval(intervalId)
        console.log("Client disconnected, stopped sending gold prices.")
    })

}

export async function handlePost(req, res, baseDir) {
    try {
        const parsedJson = await parsedJsonBody(req)
        await addBuyData(parsedJson, baseDir)
        boughtEvents.emit('bought', parsedJson)
        sendResponse(res, 201, 'application/json', JSON.stringify(parsedJson))
    } catch (err) {
        sendResponse(res, 400, 'application/json', JSON.stringify({ error: err }))
    }
}