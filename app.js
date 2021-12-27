const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Blog = require('./models/Blog');

const app = express();
app.set('view engine', 'ejs');
dotenv.config();

// middleware
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(_data=>app.listen(3000))
    .catch(err=>console.log(err));

app.get('/', (req,res)=>{
    Blog.find()
        .then(blogs=>{
            res.render('home', { blogs })
        })
        .catch(err=>res.send(err));
});

app.get('/blogs/create', function (req, res) {
  res.render('create');
});

app.post('/blogs', (req, res)=>{
    const { title, description, content } = req.body;
    console.log(title, description, content);
    res.redirect('/');
})

// Blog.create({
//     title: 'TEST2',
//     description: 'TESTING MODEL SECOND',
//     content: 'THIS IS WORKING!'
//   })
//     .then(blog=>res.json(blog))
//     .catch(err=>res.send(err))