const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Season = new Schema(
    {
    seriesID:{type: Number, required: true},
    name_anime:{type: String, required: true},
    season_item:[{
        slug:{type: String, required: true},
        name_season: {type: String, required: true},
    }]
}, 
{
    timestamps: true,
});

const UseModel = mongoose.model('Season', Season);
module.exports = UseModel;