const $ = require('jquery')
const DogAPI = require('../../js/doggo')
// const { DogAPI, sayHello } = require('../../js/doggo')

const myDogAPI = new DogAPI()

const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

$('#colorizeButton').on('click', () => {
    $('.rainbow-filter').hide()
    $('#colorLabBody').css('background-color', getRandomColor())
    $('#colorLabTitle').css('color', getRandomColor())
})

let rainbowize = false

$('#rainbowizeButton').on('click', () => {
    rainbowize = !rainbowize
    if (rainbowize) {
        $('.rainbow-filter').show()
    } else {
        $('.rainbow-filter').hide()
    }
})

$('#dogButton').on('click', () => {
    myDogAPI.getDoggo()
    $('#doggoImage').attr('src', myDogAPI.imageSrc)
})
