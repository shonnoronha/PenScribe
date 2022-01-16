const Blog = require('../models/Blog');
const User = require('../models/User');
const { formatDistanceToNow, format } = require('date-fns');
const jwt = require('jsonwebtoken');

const getLoggedInUserID = (req) =>{
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token , process.env.JWTSECRET);
    return decoded.id;
}

module.exports.home_get = (req,res)=>{
    Blog.find().sort({'createdAt': -1})
        .then(blogs=>{
            blogs.forEach(blog=>blog.relUpdate=formatDistanceToNow(blog.updatedAt, { addSuffix: true }));
            res.render('home', { blogs })
        })
        .catch(err=>res.send(err));
};

module.exports.blogs_create_get = (req, res) => {
    res.render('create');
};

module.exports.blogs_detail_id_get = (req, res)=>{
    const id = req.params.id;
    const currentUserId = getLoggedInUserID(req);
    Blog.findById(id)
        .then(async(blog)=>{
            blog.formatedDate = format(blog.createdAt, 'do MMMM yyyy');
            const author = await User.findById(blog.author._id);
            const isAuthor = currentUserId === author._id.valueOf();
            blog.authorName = author.username;
            res.render('detail', { blog,isAuthor });
        })
        .catch(err=>console.log(err));
};

module.exports.blogs_id_delete = (req, res)=>{
    const id = req.params.id;
    const currentUserId = getLoggedInUserID(req);
    Blog.findById(id)
        .then(blog=>{
            if (blog.author._id.valueOf() === currentUserId){
                Blog.findByIdAndDelete(id)
                    .then(_=>res.json({redirect : '/'}))
                    .catch(e=>console.log(e));
            }
        })
        .catch(err=>console.log(err));
};

module.exports.blogs_post = (req, res)=>{
    const author = getLoggedInUserID(req);
    const { title, description, content } = req.body;
    Blog.create({ title,description,content,author })
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
};
module.exports.blogs_detail_update_id_get = (req, res)=>{
    const currentUserId = getLoggedInUserID(req);
    Blog.findById(req.params.id)
        .then(blog=>{
            if (blog.author._id.valueOf() === currentUserId){
                res.render('update', { blog })
            } else {
                res.redirect('/');
            }
        })
        .catch(err=>console.log(err));
};

module.exports.blogs_detail_update_id_post = (req, res)=>{
    const { title, description, content } = req.body;
    const currentUserId = getLoggedInUserID(req);
    Blog.findById(req.params.id)
        .then(blog=>{
            if (blog.author._id.valueOf() === currentUserId){
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
            } else {
                res.redirect('/');
            }
        })
        .catch(err=>console.log(err));
};

