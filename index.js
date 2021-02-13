const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const bodyParser = require('body-parser');
const config = require('./config/key');

const app = express();
const port =5000;

// Decodes parsed data from the client 
app.use(bodyParser.urlencoded({extended: true})); // with the type "application/x-www-form-urlencoded"
app.use(bodyParser.json()); //with the type "application/json"

mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {res.send('<h2>Hello World! Nodemon Works</h2>')});

app.post('/register', (req,res) => {
  //Get user information from the client and put that into the database
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if(err) return res.json({success : false, err});
    return res.status(200).json({success : true});  //status(200) = 성공 
  })

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})