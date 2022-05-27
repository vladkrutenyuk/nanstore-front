import express from 'express'
import path from 'path'

const __dirname = path.resolve()
const PORT = process.env.PORT ?? 3000
const app = express()

app.use(express.static(path.resolve(__dirname, 'dist')))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})

app.get('/magazin', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'magazin.html'))
})

app.get('/magazin/:itemId', (req, res) => {
    const {itemId} = req.params
    res.send(`<h1>${itemId}<h1/>`)
})

app.listen(PORT, () => {
    console.log(`Server has been started on http://localhost:${PORT} ...`)
})