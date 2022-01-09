const Blog = require('../models/Blog');
const { formatDistanceToNow, format } = require('date-fns');

module.exports.home_get = (req,res)=>{
    Blog.find()
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
    Blog.findById(id)
        .then(blog=>{
            blog.formatedDate = format(blog.createdAt, 'do MMMM yyyy');
            res.render('detail', { blog });
        })
        .catch(err=>console.log(err));
};

module.exports.blogs_id_delete = (req, res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
        .then(data=>{
            res.json({redirect : '/'});
        })
        .catch(err=>console.log(err));
};

module.exports.blogs_post = (req, res)=>{
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
};

module.exports.blogs_detail_update_id_get = (req, res)=>{
    Blog.findById(req.params.id)
        .then(blog=>res.render('update', { blog }))
        .catch(err=>console.log(err));
};

module.exports.blogs_detail_update_id_post = (req, res)=>{
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
};