const User = require("../model/user")
const jwt = require("jsonwebtoken")
const fs = require("fs")

//READ FILE
let secret;
try {
  secret = fs.readFileSync('scrt.txt', 'utf8');
} catch (err) {
  console.error('Error reading scrt.txt:', err);
}

//HANDLE ERRORS
const handleErrors=(err)=>{
    let errors  = {email:'',password:''};

    if(err.message ==='incorrect email'){
        errors.email=err.message;
    }
    if(err.message ==='incorrect password'){
        errors.password=err.message;
    }

    //Duplication Errors
    if(err.code==11000){
        errors.email= `Email is already registered`;
        return errors;
    }

    // Validation Errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(error=>{
            const properties = error.properties
            errors[properties.path]=properties.message;
        })
    }

    return errors
}

const maxAge = 3*24*60*60;
 
const createJWT =(id)=>{
     return jwt.sign({id},secret,{
        expiresIn:maxAge
     });
}


//GET REQUEST
function getSignUpHandler(req,res){
   res.render('signup')
}

function getLoginHandler(req,res){
    res.render('login')
}


//POST REQUESTS
async function PostSignUpHandler(req,res){
    const {email,password} = req.body;

    try{
        const user =  await User.create({
        email,password
        })
        return res.status(201).json({mssg:"user is created"});
    }
    catch(err){
       const errors =  handleErrors(err);
       return res.status(400).json({errors})
    }

}

async function PostLoginHandler(req,res){
    const {email,password} = req.body
    try{
       const user = await User.login(email,password)
       const token = createJWT(user._id);
       res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000})
       
       res.status(201).json({mssg:"USER LOGS IN"})
    }
    catch(err){
       const errors =  handleErrors(err);
       res.status(400).json({error_message:'USER LOGIN FAILED',errors})
    }
}

module.exports={getSignUpHandler,getLoginHandler,PostLoginHandler,PostSignUpHandler}