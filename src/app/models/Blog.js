const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Blog = new Schema(
    {
    id:{type: Number, required: true },
    slug:{type: String, required: true},
    image:{type: String, required: true},
    destription:{type: String, required: true},
    title:{type: String, required: true},
    video:{type: String, required: true},
}, 
{
    timestamps: true,
});

const UseModel = mongoose.model('Blog', Blog);
module.exports = UseModel;