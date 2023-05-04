 const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')  //a function that let's us connect to the database
const mainRoutes = require('./routes/main') //telling our server to say this is the location of the additonal paths that you can send data to
const todoRoutes = require('./routes/todos')

require('dotenv').config({path: './config/.env'}) //SPECIFIYING LOCATIONS: WHERE THINGS ARE

// Passport config
require('./config/passport')(passport) //specifying location

connectDB() // CALL THIS FUNCTION TO START THE DATABASE

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) //middleware
app.use(express.json()) // setting middleware to do stuff
app.use(logger('dev')) //middleware
// Sessions //verifying that you are logged in
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
app.use(passport.initialize()) //help with authentication
app.use(passport.session())

app.use(flash())
  
app.use('/', mainRoutes)
app.use('/todos', todoRoutes) 
 
app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    