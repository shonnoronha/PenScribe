const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next)=>{
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, process.env.JWTSECRET, (err, _decodedToken)=>{
            if (err){
                res.redirect('/login');
            } else{
                next();
            }
        });
    } else{
        res.redirect('/login');
    }
};

const getUser =  (req, res, next) => {
    const token = req.cookies.jwt;
    if (token){
        jwt.verify(token, process.env.JWTSECRET,async (err, decodedToken)=>{
            if (err){
                res.locals.user = null;
                next();
            }else{
                const id = decodedToken.id;
                const user = await User.findById(id);
                res.locals.user = user;
                next();
            }
        })
    } else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, getUser };