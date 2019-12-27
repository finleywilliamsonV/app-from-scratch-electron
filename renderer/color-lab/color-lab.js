const $ = require('jquery')

console.log('starting color lab js')

const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

$('#colorizeButton').on('click', () => {
    $('#colorLabBody').css('background-color', getRandomColor())
    $('#colorLabTitle').css('color', getRandomColor())
})
