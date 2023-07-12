const { Router } = require('express')
const mongoose = require('mongoose')
const router = new Router()
const bcryptjs = require('bcryptjs')
const saltRounds = 16
const User = require('../models/User.model')

// GET signup page
router.get('/signup', (req, res, next) => {
    res.render('auth/signup')
})

// POST data to register new user
router.post('/signup', (req, res, next) => {
    // console.log('the form data: ', req.body)

    const { username, email, password } = req.body

     // making sure users fillout all mandatory fileds:
     if (!username || !email || !password) {
        res.render('auth/signup', { errorMessage: 'All fields are mandetory. Please provide your username, email and password.'})
        return
    } 

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                // username: username
                username,
                email,
                passwordHash: hashedPassword
            })
        })
        .then(userFromDB => {
          //  console.log('Newly created user is: ', userFromDB)
          res.redirect('/userProfile')
        })
        .catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              res.status(500).render('auth/signup', { errorMessage: error.message })
            } else if (error.code === 11000) {
              res.status(500).render('auth/signup', {
                 errorMessage: 'Username and email need to be unique. Either username or email is already used.'
              })
            } else {
              next(error);
            }
          })
})

// GET login page
router.get('/login', (req, res, next) => {
    res.render('auth/login')
})

// POST data to check if our user is our user
router.post('/login', async (req, res, next) => { 
    console.log(req.body)
    try {
        const checkUser = req.body
        const checkedUser = await User.findOne({ email : checkedUser.email.toLowerCase })
        console.log('checkedUser: ', checkedUser)
    } catch (error) {
        
    }
})
router.get('/userProfile', (req, res) => 
res.render('users/user-profile'))

module.exports = router