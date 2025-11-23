import 'reflect-metadata'
import express from 'express'
import bodyParser from 'body-parser'
import {initializeDatabase} from './database'
import path from 'path'
import expressLayouts from 'express-ejs-layouts'
import session from 'express-session'
import dashboard from './controllers/dashboard'
import createDevice from './controllers/createDevice'
import addMeasurements from './controllers/measurement'
import editDevice from './controllers/editDevice'
import deleteDevice from './controllers/deleteDevice'
import deviceDetail from './controllers/deviceDetail'
import {getLogin, logout, postLogin} from './controllers/login'
import authMiddleware from './middleware/auth'

initializeDatabase()

const app = express()

// EJS setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(expressLayouts)
app.set('layout', 'layout')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Session setup - use env SESSION_SECRET in production
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false}
}))

// Static files
app.use('/static', express.static(path.join(__dirname, '../public')))

// Public auth routes
app.get('/login', getLogin)
app.post('/login', postLogin)
app.get('/logout', logout)

// Auth middleware protects everything below
app.use(authMiddleware)

// Controllers (protected)
app.get('/', dashboard)
app.get('/devices/add', createDevice.getForm)
app.post('/devices/add', createDevice.createDevice)
app.get('/devices/:id/edit', editDevice.getForm)
app.post('/devices/:id/edit', editDevice.updateDevice)
app.get('/devices/:id/delete', deleteDevice)
app.get('/devices/:id', deviceDetail)
app.post('/measurements', addMeasurements)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`🚀 Server run on http://localhost:${PORT}`)
})
