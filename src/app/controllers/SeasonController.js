const express = require('express');
const app = express();
const Anime = require('../models/Anime');
const Blog = require('../models/Blog');
const Season = require('../models/Season');
const { mongooseToObject } = require('../../uti/mongoose')
const { mutipleMongooseToObject } = require('../../uti/mongoose')


class seasonController {

    //[GET] /:slug
    show(req, res) {
        Promise.all([
            Anime.find({}),
            Season.find({}),
        ])
        .then(([animes,seasons]) => {
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

            const seasonsulg = (req.params.slug);
            const actionMovie = animes.filter(movie =>
                movie.InfoList &&
                Array.isArray(movie.InfoList.Season) &&
                processString(movie.InfoList.Season[0]) === seasonsulg
            );
            const actionMovies = mutipleMongooseToObject(actionMovie);
            
            // res.json(seasonData);
            // Render trang và truyền cả hai loại dữ liệu vào
            res.render('season/show', { 
                actionMovies,
                top_bo: animeboData.slice(0, 5),
                top_le: animeleData.slice(0, 5),

            });
        })
        .catch(error => next(error));
    }
}
module.exports = new seasonController();