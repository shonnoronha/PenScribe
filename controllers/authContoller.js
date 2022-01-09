const User = require('../models/User');
const jwt = require('jsonwebtoken');

let signedIn = 0;
const maxAge = 3 * 24 * 60 * 60;

const createToken = id => {
    return jwt.sign({ id },process.env.JWTSECRET ,{
        expiresIn: maxAge,
    })
};

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

module.exports.signup_get = (req, res)=>{
    res.render('signup');
};

module.exports.signup_post = (req, res)=>{
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
};

module.exports.login_get = (req, res)=>{
    if (signedIn) res.locals.msg = 'Account Created SuccessFully! Please Log in';
    else res.locals.msg = null;
    res.render('login');
};

module.exports.login_post = async (req, res)=>{
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
};

module.exports.logout_get = (req, res)=>{
    res.cookie('jwt', '', { maxAge: 1 });
    res.locals.msg = null;
    res.redirect('/login');
};