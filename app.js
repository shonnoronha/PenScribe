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

app.get('/blogs/detail/:id', (req, res)=>{
    const id = req.params.id;
    Blog.findById(id)
        .then(blog=>{
            res.render('detail', { blog });
        })
        .catch(err=>console.log(err));
});

app.delete('/blogs/:id', (req, res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(data=>{
            res.json({redirect : '/'});
        })
        .catch(err=>console.log(err));
})

app.post('/blogs', (req, res)=>{
    const { title, description, content } = req.body;
    Blog.create({
        title,
        description,
        content
      })
        .then(_blog=>res.redirect('/'))
        .catch(err=>console.log(err));
});