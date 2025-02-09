const jwt = require('jsonwebtoken');
const User = require("../model/user")

const checkAuth=(req,res,next)=>{
    const token = req.cookies.jwt
    if(token){
            jwt.verify(token,'anime@911',(err,decodedToken)=>{
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
            jwt.verify(token,'anime@911',async (err,decodedToken)=>{
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
