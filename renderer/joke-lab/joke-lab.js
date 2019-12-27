const { ipcRenderer } = require('electron')
const $ = require('jquery')

const jokeAPIUrl = 'https://sv443.net/jokeapi/category/programming?blacklistFlags=nsfw,religious,political'

$('#randomJokeButton').on('click', () => {
    $('#jokePartI').text('')
    $('#jokePartII').text('')
    ipcRenderer.send('http-request', { url: jokeAPIUrl })
})

ipcRenderer.on('http-response', (e, args) => {
    if (args.type === 'single') {
        $('#jokePartI').text(args.joke)
    } else {
        $('#jokePartI').text(args.setup)
        $('#jokePartII').text(args.delivery)
    }
})
