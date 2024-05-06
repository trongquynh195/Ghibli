const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Anime = new Schema(
    {
    id:{type: Number,  default:''},
    title: { type: String },
    subtitle: { type: String, required: true },
    slug: { type: String, slug: "title" },
    banner: { type: String, required:true },
    poster: { type: String, required: true },
    description: { type: String,required: true },
    InfoList: {
        View:{ type: Number, default:''},
        Trailer:{type: String, default:''},
        Episodes:[
            {
                tap:{ type: String,  default:''},
                slug:{ type: String,  default:'' }
            }
        ],
        Release_Schedule:{ type: String, default:'' },
        Status:{ type: String,  default:'' },
        Genre:[{ type: String,  default:'' }],
        Director:{ type:String, default:'' },
        Country:{ type:String, default:'' },
        Number_of_Followers:{ type: Number,  default:''},
        Duration:{ type: String,  default:''},
        Quality:{ type: String,  default:''},
        Rating:{ type: String,  default:''},
        Language:{ type: String,  default:''},
        Studio:{ type: String,  default:''},
        Season:[{type: String,  default:''}],
    }
}, 
{
    timestamps: true,
});

const UseModel = mongoose.model('Anime', Anime);
module.exports = UseModel;