const express = require('express')
const app = express()
const connectDB = require('./db')
const cookieParser = require('cookie-parser')
const {adminAuth, userAuth} = require('./middleware/auth')
const PORT = 5000;

app.set("view engine", "ejs")

connectDB()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(cookieParser())
app.use('/api/Auth', require('./Auth/Route'))

app.get('/', (req, res) => res.render('home'))
app.get('/register', (req, res) => res.render('register'))
app.get('/login', (req, res) => res.render('login'))
app.get('/logout', (req, res) => {
    res.cookie('jwt', '', {maxAge: '1'})
    res.redirect('/')
})
app.get('/admin', adminAuth, (req, res) => res.render("admin"))
app.get('/basic', userAuth, (req, res) => res.render("user"))


const server = app.listen(PORT, () => {
    console.log(`Server Connected to port ${PORT}`);
})

process.on('unhandledRejection', err => {
    console.log(`An error occured: ${err.message}`);
    server.close(() => process.exit(1))
})