const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Filter = require('bad-words');
const filter = new Filter();

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
    author: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    likes:{
        type: Number,
        default: 0
    }
}, {
    timestamps : true,
});

blogSchema.pre('save', function(next){
    this.title = filter.clean(this.title);
    this.description = filter.clean(this.description);
    this.content = filter.clean(this.content);
    next();
});

const Blog = mongoose.model('blog', blogSchema);

module.exports = Blog;