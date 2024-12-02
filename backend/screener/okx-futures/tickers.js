const okx = require('okx-api')


const client = new okx.RestClient()


const getFuturesTickers = async () => {
    try {
        const result = await client.getTickers(
            'SWAP' // 'SPOT' | 'MARGIN' | 'SWAP' | 'FUTURES' | 'OPTION'
        )
        console.log('OKX FUTURES tickers length: ', result.length)
        return result
    } catch (e) {
        console.log(e.message)
        return getFuturesTickers()
    }

}


module.exports = {
    getFuturesTickers
}
