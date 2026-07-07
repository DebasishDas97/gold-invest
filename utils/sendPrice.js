export function sendPrice(res, goldPrice) {
    res.write(
        `event: gold-price\n` +
        `data: ${JSON.stringify({ price: goldPrice })}\n\n`
    );
}