const mongoose = require("mongoose");
const {isEmail} = require("validator")
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:[true,'Please enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please enter a valid email']
    },

    password:{
        type:String,
        required:[true,'Please enter a password'],
        minlength:[6,'Minimum Password Length is 6 characters']
    }
})

//MONGOOSE HOOKS
// THESE ARE THE FUNCTIONS THAT EXECUTE AFTER THE COMPLETION OR BEGINNING OF CERTAIN EVENT(LIKE SAVE THE USER TO DATABASE)
// THESE ARE ALSO KIND OF A MIDDLEWARE (MONGOOSE MIDDLEWARE)

//fire a function after doc saved to db
// userSchema.post('save',function(doc,next){
//     console.log('new user was created and save',doc);
//     next();
// })

//fire a function before doc saved to db
userSchema.pre('save',async function(next){
    // console.log('user is about to be created and save',this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

//static method (attaching to user Schema) to login
userSchema.statics.login = async function (email,password) {
    const user = await this.findOne({email:email})
    if(user){
        const auth = await bcrypt.compare(password,user.password)
        if(auth){
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}

const User = mongoose.model('auth_user',userSchema);

module.exports = User;