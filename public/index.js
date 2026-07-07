const eventSource = new EventSource('/stream')
const goldPriceElement = document.getElementById('price-display')
const connectionStatus = document.getElementById('connection-status')
const investmentSummary = document.getElementById('investment-summary')
const form = document.querySelector('form')
const investedAmount = document.getElementById('investment-amount')
const dialog = document.querySelector('.outputs')
const dialogBtn = document.querySelector('.outputs button')

eventSource.addEventListener('gold-price', (event) => {
    const data = JSON.parse(event.data)
    if (data.price) {
        connectionStatus.textContent = "Live Price 🟢"
        goldPriceElement.textContent = data.price
    }
})

eventSource.addEventListener('error', (event) => {
    if (eventSource.readyState === EventSource.CLOSED) {
        connectionStatus.textContent = 'Disconnected 🔴'
        goldPriceElement.textContent = '----.--'
    } else {
        connectionStatus.textContent = 'Reconnecting...'
        goldPriceElement.textContent = '----.--';
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const submitButton = e.submitter
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...'
    const formData = new FormData(form)
    const formObj = Object.fromEntries(formData)

    if (investedAmount.value > 0) {
        const pricePerGram = parseFloat(goldPriceElement.textContent);
        const investedMoney = parseFloat(investedAmount.value);
        const calculatedQuantity = (investedMoney / pricePerGram).toFixed(4);

        const buyingData = {
            email: `${formObj.email}`,
            price: `Rs. ${investedMoney.toFixed(2)}`,
            quantity: `${calculatedQuantity}g`
        }

        try {
            const response = await fetch('/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buyingData),
            })
            if (!response.ok) {
                throw new Error('Server fail')
            } else {
                dialog.showModal()
                investmentSummary.innerHTML = `You just invested <b>₹${investedMoney.toLocaleString('en-IN')}</b> and bought <b>${calculatedQuantity}g</b> of 24K Gold! <br><br> You will receive your PDF receipt shortly in your email.`
                investedAmount.value = ''
                form.reset()
            }
        } catch (err) {
            console.log('We have a Error : ', err)
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Invest Now'
        }
    }
})


dialogBtn.addEventListener('click', (e) => {
    e.preventDefault()
    dialog.close()
})





