const express = require('express');
const mongoose = require('mongoose');
const route = require("./routes/auth")
const cookieParser = require("cookie-parser")
const {checkUserLogin} = require("./middlewares/auth")

const app = express();

// view engine
app.set('view engine', 'ejs');

// middleware
app.use(express.static('public')); // to use css
app.use(express.json()); // to use json
app.use(cookieParser());


app.use("*",checkUserLogin);
app.use("/",route);



// database connection
const dbURI = "mongodb+srv://anikettiwari256:Anime11@cluster1.c8bbp.mongodb.net/auth_test"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));



