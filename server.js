import express from 'express'
import cookieParser from 'cookie-parser'
import { loggerService } from './services/logger.service.js'
import { bugService } from './services/bug.service.js'
const app = express()
app.get('/', (req, res) => res.send('Hello there'))
const port = 3040
app.listen(port, () => console.log('Server ready at port 3040'))

//* Express Config:
app.use(cookieParser())
app.use(express.static('public'))

//* Express Routing:
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt,
        minSpeed: +req.query.minSpeed
    }
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(500).send('Cannot get bugs')
        })
})

app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        vendor: req.query.vendor,
        speed: +req.query.speed
    }

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(500).send('Cannot save bug', err)
        })
})

app.get('/api/bug/:bugId', (req, res) => {
    // console.log('req.params:', req.params)
    const { bugId } = req.params
    console.log('bugId:', bugId)
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})


app.get('/api/bug/:bugId/remove', (req, res) => {
    // console.log('req.params:', req.params)
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(`bug (${bugId}) removed!`))
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug', err)
        })

})






