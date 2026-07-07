let goldPrice = 28450.23; // Initial price (₹ per 10g)

export function getGoldPrice() {
  // Random change between -25 and +25
  const change = Math.floor(Math.random() * 51) - 25.27;

  goldPrice += change;

  return goldPrice.toFixed(2)
}