const port = 3000

require('./src/app').listen(port, () => {
    console.log(`Pixel webserver ready at http://localhost:${port}`)
})
