const mongoose = require('mongoose');

module.exports.connect = () => {
    mongoose.connect(process.env.MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(_data=>{
            console.log('Connected To Database!')
        })
        .catch(err=>{
            console.error(err);
            process.exit(1);
        });
}