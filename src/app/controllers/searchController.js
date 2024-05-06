const Anime = require('../models/Anime');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Season = require('../models/Season');
const bcrypt = require('bcrypt');
const { mongooseToObject } = require('../../uti/mongoose')
const { mutipleMongooseToObject } = require('../../uti/mongoose')

class searchController{
    show(req, res) {
        Promise.all([
            Anime.find({}),
        ])
        .then(([animes]) => {
            function processString(str) {
                return str
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/ô/g, "o")
                    .replace(/đ/g, "d");
            }
            const animele = animes.filter(movie =>
                movie.InfoList &&
                Array.isArray(movie.InfoList.Genre) &&
                movie.InfoList.Genre.some(genre => processString(genre) === "anime-le")
            );
            const animebo = animes.filter(movie =>
                movie.InfoList &&
                Array.isArray(movie.InfoList.Genre) &&
                movie.InfoList.Genre.some(genre => processString(genre) === "anime-bo")
            );

            // Chuyển đổi dữ liệu từ Mongoose object sang plain object
            const animeboData = mutipleMongooseToObject(animebo);
            const animeleData = mutipleMongooseToObject(animele.reverse());


            const searchText = req.body.search; // Giả sử searchText là trường cần tìm kiếm từ req.body

            Anime.find({ "title": new RegExp(searchText, "i") })
                .then(actionMovie => {
                    const actionMovies = mutipleMongooseToObject(actionMovie);

                    res.render('season/show', { 
                        actionMovies: actionMovies,
                        top_bo: animeboData.slice(0, 5),
                        top_le: animeleData.slice(0, 5),
                    });
                    // res.json(actionMovies);
                })
                .catch(err => {
                    // Xử lý lỗi nếu có
                    res.status(500).send(err);
                });
            // res.json(req.body);
        })
        .catch(error => next(error));
    }
}
module.exports = new searchController();