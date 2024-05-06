const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String,required: true,minlength: 6,maxlength:20, unique: true},
    email: { type: String,  required: true, minlength: 10,maxlength:50, unique: true },
    password: { type: String, required: true, minlength: 6 },
    hoten: { type: String,  maxlength:30 ,default:''},
    gender: { type: Number,default:'1'},
    admin:{
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const UseModel = mongoose.model('User', userSchema);
module.exports = UseModel;