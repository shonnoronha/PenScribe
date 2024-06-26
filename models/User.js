const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        required: [true, 'Please Enter an username'],
        minlength: [4, 'Username must be atleast 4 charcters long!']
    },
    email: {
        type: String,
        required: [true, 'Please Enter an Email address'],
        validate: [isEmail, 'Please Enter a Valid Email address!'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please Enter a Password!'],
        minlength: [6, 'Password Must be atleast 6 charcters long!']
    }
}, {
    timestamps: true,
});

userSchema.pre('save', function(next){
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

userSchema.statics.login = async function(username, password){
    const user = await this.findOne({ username });
    if (user){
        if (bcrypt.compareSync(password, user.password)){
            return user;
        } else{
            throw Error('Incorrect password!');
        }
    } else{
        throw Error('Username Does Not Exist! Please Sign In!');
    }
};

const User = mongoose.model('user', userSchema);

module.exports = User;