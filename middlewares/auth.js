const jwt = require('jsonwebtoken');
const User = require("../model/user")
const fs = require('fs')

//READ FILE
let secret;
try {
  secret = fs.readFileSync('scrt.txt', 'utf8');
} catch (err) {
  console.error('Error reading scrt.txt:', err);
}

console.log(secret)

const checkAuth=(req,res,next)=>{
    const token = req.cookies.jwt
    if(token){
            jwt.verify(token,secret,(err,decodedToken)=>{
                if(err){
                    res.redirect('/login')
                }else{
                    next();
                }
            })

    }
    else{
        res.redirect('/login')
    }
}


const checkUserLogin = async(req,res,next)=>{
    const token = req.cookies.jwt
    if(token){
            jwt.verify(token,secret,async (err,decodedToken)=>{
                if(err){
                    res.locals.user = null;

                    next();
                }else{
                    const user = await User.findById(decodedToken.id)
                    res.locals.user = user;
                    next();
                }
            })

    }
    else{
        res.locals.user = null;

        next();
    }
}

module.exports =  {checkAuth,checkUserLogin}
