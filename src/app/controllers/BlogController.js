const express = require('express');
const app = express();
const Anime = require('../models/Anime');
const Blog = require('../models/Blog');
const Season = require('../models/Season');
const { mongooseToObject } = require('../../uti/mongoose')
const { mutipleMongooseToObject } = require('../../uti/mongoose')

class BlogController {
    show(req, res) {
        Promise.all([
            Anime.find({}),
            Season.find({}),
            Blog.findOne({slug: req.params.slug}),
        ])
        .then(([animes,seasons,blogs]) => {
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
            const blogData = mongooseToObject(blogs);
            
            // res.json(blogs);
            // Render trang và truyền cả hai loại dữ liệu vào
            res.render('blog/show', { 
                blog: blogData,
                top_bo: animeboData.slice(0, 5),
                top_le: animeleData.slice(0, 5),

            });
        })
        .catch(error => next(error));
    }
}

module.exports = new BlogController();