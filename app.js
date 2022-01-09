const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Blog = require('./models/Blog');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const { requireAuth, getUser } = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const { formatDistanceToNow, format } = require('date-fns');

const app = express();
app.set('view engine', 'ejs');
dotenv.config();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(_data=>{
        app.listen(3000)
        console.log('Server Listening on http://localhost:3000/')
    })
    .catch(err=>console.log(err));

app.get('*', getUser);

app.get('/',(req,res)=>{
    Blog.find()
        .then(blogs=>{
            blogs.forEach(blog=>blog.relUpdate=formatDistanceToNow(blog.updatedAt, { addSuffix: true }));
            res.render('home', { blogs })
        })
        .catch(err=>res.send(err));
});

const maxAge = 3 * 24 * 60 * 60;

const createToken = id => {
    return jwt.sign({ id },process.env.JWTSECRET ,{
        expiresIn: maxAge,
    })
};

app.get('/blogs/create',requireAuth, function (req, res) {
  res.render('create');
});

app.get('/blogs/detail/:id',requireAuth, (req, res)=>{
    const id = req.params.id;
    Blog.findById(id)
        .then(blog=>{
            blog.formatedDate = format(blog.createdAt, 'do MMMM yyyy');
            res.render('detail', { blog });
        })
        .catch(err=>console.log(err));
});

app.delete('/blogs/:id',requireAuth, (req, res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(data=>{
            res.json({redirect : '/'});
        })
        .catch(err=>console.log(err));
})

app.post('/blogs',requireAuth, (req, res)=>{
    const { title, description, content } = req.body;
    Blog.create({ title,description,content })
        .then(blog=>{
            res.json({
                blog,
                redirect: '/',
            });
        })
        .catch(error=>{
            console.log(error);
            const errorMessage = Object.values(error)[0].title.properties.message;
            res.json({
                errors:errorMessage
            });
        });
});

app.get('/blogs/detail/update/:id',requireAuth, (req, res)=>{
    Blog.findById(req.params.id)
        .then(blog=>res.render('update', { blog }))
        .catch(err=>console.log(err));
});

app.post('/blogs/detail/update/:id',requireAuth, (req, res)=>{
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
    } else if (err.message === 'Incorrect password!'){
        errors.password = err.message;
    } else if (err.message === 'Username Does Not Exist! Please Sign In!'){
        errors.username = err.message;
    }
    return errors;
};

let signedIn = 0;

app.post('/signup', (req, res)=>{
    const { username, password, email } = req.body;
    User.create({ username, password, email })
        .then(user=>{
            signedIn = 1;
            res.json({
                user,
                redirect: '/login'
            });
        })
        .catch(err=>{
            res.status(400).json({
                errors: errorHandler(err),
            });
        })
});

app.get('/login', (req, res)=>{
    if (signedIn) res.locals.msg = 'Account Created SuccessFully! Please Log in';
    else res.locals.msg = null;
    res.render('login');
});

app.post('/login', async (req, res)=>{
    const { username, password } = req.body;
    try{
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: maxAge * 1000
        });
        res.json({
            user: user._id,
            redirect: '/',
        });
    } catch (err){
        res.status(401).json({
            errors: errorHandler(err),
        })
    }
});

app.get('/logout',requireAuth, (req, res)=>{
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/login');
})

app.use((req, res)=>{
    res.render('404');
});