const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Blog = require('./models/Blog');
const User = require('./models/User');

const app = express();
app.set('view engine', 'ejs');
dotenv.config();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(_data=>{
        app.listen(3000)
        console.log('Server Listening on http://localhost:3000/')
    })
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
    console.log(title, description, content);
    Blog.create({ title,description,content })
        .then(blog=>{
            res.json({
                blog,
                redirect: '/',
            });
        })
        .catch(error=>{
            const errorMessage = Object.values(error)[0].title.properties.message;
            res.json({
                errors:errorMessage
            });
        });
});

app.get('/blogs/detail/update/:id', (req, res)=>{
    Blog.findById(req.params.id)
        .then(blog=>res.render('update', { blog }))
        .catch(err=>console.log(err));
});

app.post('/blogs/detail/update/:id', (req, res)=>{
    const { title, description, content } = req.body;
    Blog.findByIdAndUpdate(req.params.id, { title, description, content }, {
        runValidators:true,
    })
        .then(blog=>{
            res.json({
                blog,
                redirect: '/',
            })
        })
        .catch(error=>{
            const errorMessage = Object.values(error)[0].title.properties.message;
            res.json({
                errors:errorMessage
            });
        });
});

app.get('/signup', (req, res)=>{
    res.render('signup');
});

const errorHandler = (err) => {
    let errors = {
        username: '',
        password: '',
        email: '',
    };
    if (err.code === 11000){
        const errorType = Object.keys(err.keyPattern)[0];
        if (errorType === 'email'){
            errors.email = 'Email Already Exists! Please Log In!';
        } 
        if (errorType === 'username'){
            errors.username = 'Username Already Exists! Please Log In!';
        }
    } else if (err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({ properties })=>{
            errors[properties.path] = properties.message
        })
    }
    return errors;
}

app.post('/signup', (req, res)=>{
    const { username, password, email } = req.body;
    User.create({ username, password, email })
        .then(user=>{
            res.json({
                user,
                redirect: '/'
            });
        })
        .catch(err=>{
            res.status(400).json({
                errors: errorHandler(err),
            });
        })
})