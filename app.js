const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
const User = require('./models/User')
const { exists } = require('./models/User');
const bcrypt = require('bcrypt');
const res = require('express/lib/response');


mongoose.connect('mongodb://localhost:27017/loginTask')

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", () => {
    console.log('database connnected');
})

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (req,res)=>{
    res.render('index')
})
app.get('/register', (req,res) =>{
    res.render('register')
})

app.post('/register', async (req,res) =>{
    let username = req.body.username
    let password = req.body.password

    let hashedPassword= await bcrypt.hash(password, 10 )

    let newUser = ({username:username, password: hashedPassword})
    User.create(newUser,(err)=>{
        if(err)
        console.log(err);
        else
        console.log('New User created');
        res.redirect('login')
    })
})

app.get('/login', (req,res)=>{
    res.render('login')
})

app.post('/login', (req,res) =>{
    const password = req.body.password
    User.findOne({
    username: req.body.username}).then((data)=>{
        if(data){
            bcrypt.compare(password, data.password).then((value) =>{
                if(value){
                    res.redirect('/admin')
                }else(
                    res.send('Wrong Password')
                    )
            })
        }else{
            res.json('No user found');
        }
    })
  })

app.get('/admin', (req,res) =>{
    User.find({}, (err, allUsers)=>{
        if(err){
            console.log(err);
        }else{
            res.render('admin', {allUsers: allUsers})
        }
    })
})

// Edit 
app.get('/edit/:id', (req,res) =>{
    res.render('edit')
})


app.listen('5000', () => {
    console.log('Server started');
})