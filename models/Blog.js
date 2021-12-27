const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is Required'],
        minlength: [4, 'Title must be atleast 4 characters long']
    },
    description: {
        type: String,
        required: [true, 'Please Provide A short description of Your Blog']
    },
    content: {
        type: String,
        required:[true, 'Content is required']
    },
    likes:{
        type: Number,
        default: 0
    }
}, {
    timestamps : true,
});

const Blog = mongoose.model('blog', blogSchema);

module.exports = Blog;