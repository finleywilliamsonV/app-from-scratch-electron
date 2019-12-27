// the API is supposed to filter potentially nsfw jokes, but is doing a bad job.

const blacklistedTopics = ['sex', 'genders', 'shitty', 'fat', 'snuts']

const isJokeClean = (jokeJSON) => {
    let jokeText = ''
    if (jokeJSON.type === 'single') {
        jokeText = jokeJSON.joke
    } else {
        jokeText = `${jokeJSON.setup} ${jokeJSON.delivery}`
    }
    jokeText = jokeText.toLowerCase()
    for (let i = 0; i < blacklistedTopics.length; i++) {
        const currentTopic = blacklistedTopics[i]
        if (jokeText.indexOf(currentTopic) > -1) {
            return false
        }
    }
    return true
}

module.exports = isJokeClean
