const DogApi = require('doggo-api-wrapper')

class DogAPI {
    constructor() {
        this.dog = new DogApi()
        this.imageSrc = ''
        this.getDoggo()
    }

    getDoggo() {
        this.dog.getARandomDog().then(data => {
            this.imageSrc = data.message
        }).catch(err => console.error(err))
    }
}


// function sayHello() {
//     console.log('hello world')
// }
// module.exports = { DogAPI, sayHello }

module.exports = DogAPI
