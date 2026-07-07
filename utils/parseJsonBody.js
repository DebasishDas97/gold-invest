export async function parsedJsonBody(req) {
    let body = '';
    for await (const chunk of req) {
        body += chunk
    }

    try {
        return JSON.parse(body)
    } catch (err) {
        console.log(err)
        throw new Error('Invalid JSON received from the client.')
    }
}