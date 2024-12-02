module.exports = (val1, val2) => {
    if (typeof val1 === 'string' || typeof val2 === 'string') {
        val1 = parseFloat(val1)
        val2 = parseFloat(val2)
    }
    return (val2 - val1) / val1 * 100
}
