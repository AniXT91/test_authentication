const express  = require('express');
const {checkAuth} = require('../middlewares/auth')

const route = express.Router();

const {getSignUpHandler,PostSignUpHandler,}= require("../controller/auth");
const { getLoginHandler, PostLoginHandler } = require('../controller/auth');

route.get('/signup',getSignUpHandler)
route.get('/login',getLoginHandler)

route.post('/signup',PostSignUpHandler)
route.post('/login',PostLoginHandler)

route.get('/', (req, res) => res.render('home'));
route.get('/smoothies',checkAuth, (req, res) => res.render('smoothies'));
route.get('/logout', (req, res) => {
    res.cookie('jwt','',{maxAge:1})
    res.redirect('/')
});


// route.get('/set_cookies',(req,res)=>{
//     res.cookie('isTrue',false);
//     res.cookie('isBad',true,{maxAge:1000*60*60,httpOnly:true})

//     res.send('Cookie-Sent')
// });

// route.get('/read_cookies',(req,res)=>{
//     const cookies = req.cookies;
//     res.json(cookies);
  
// })


module.exports = route;



