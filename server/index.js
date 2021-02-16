const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const app = express();

const port = 5000;

// Decodes parsed data from the client
app.use(bodyParser.urlencoded({ extended: true })); // with the type "application/x-www-form-urlencoded"
app.use(bodyParser.json()); //with the type "application/json"
app.use(cookieParser());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.send('<h2>Hello World!</h2>');
});

app.get('/api/hello', (req,res) =>{
  res.send("Hello~~~~");
})

app.post('/api/users/register', (req, res) => {
  //Get user information from the client and put that into the database
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true }); //status(200) = 성공
  });
});

app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '해당 이메일로 로그인이 불가합니다.',
      });
    }

    //요청된 이메일이 데이터베이스에 있다면 비밀번호 체크
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });

      //비밀번호가 맞다면 토큰 발행
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        //토큰을 저장한다. 어디에? 쿠키, 로컬스토리지
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userID: user._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  //여기 까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 True라는 뜻

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
