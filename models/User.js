const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Schema 

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,

    },
    password: {
        type: String,
        required: true,
    }
});


//virtual relation ship between user and book
//createdby of book table is forign key which is _id of user table

UserSchema.virtual('books', {
    ref: 'Book',
    foreignField: 'createdBy',
    localField: '_id'
});
UserSchema.set('toJSON', { virtuals: true });


//do this before saving data
UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    try {
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (err) {
        console.log(err);
    }
});

//verify password
UserSchema.methods.isPasswordMatch = async function (passwordentered) {
    return await bcrypt.compare(passwordentered, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;