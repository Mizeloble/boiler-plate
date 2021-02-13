import express from 'express'
import mongoose from 'mongoose'
import User from "./models/User.js";
import bodyParser from "body-parser";

const app = express();
const port =3000;

//Decodes parsed data from the client 
//with the type "application/x-www-form-urlencoded"
app.use(bodyParser.urlencoded({extended: true}));
//with the type "application/json"
app.use(bodyParser.json());



mongoose.connect('mongodb+srv://mizeloble:rlawlghks@testdb.edsbq.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))


app.get('/', (req, res) => {res.send('Hello World! Nodemon Works')});

app.post('/register', (req,res) => {
  //Get user information from the client and put that into the database
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if(err) return res.json({success : false, err});
    return res.status(200).json({success : true});
  })

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})