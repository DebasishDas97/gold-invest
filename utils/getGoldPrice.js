let goldPrice = 7450.25; // Initial price (₹ in INR per gram of 24K Gold)

export function getGoldPrice() {
  // Random fluctuation between -15 and +15 INR
  const change = (Math.random() * 30) - 15;

  goldPrice += change;

  return goldPrice.toFixed(2)
}