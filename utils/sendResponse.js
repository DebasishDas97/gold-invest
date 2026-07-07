export function sendResponse(res, statusCode, contentType, payload) {
    res.setHeader('Content-Type', contentType)
    res.statusCode = statusCode
    res.end(payload)
}